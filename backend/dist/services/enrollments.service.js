"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guestCheckout = guestCheckout;
exports.initiateCheckout = initiateCheckout;
exports.handleWebhook = handleWebhook;
exports.getUserEnrollments = getUserEnrollments;
exports.getAllEnrollments = getAllEnrollments;
const pool_1 = __importDefault(require("../db/pool"));
const hesabeService = __importStar(require("./hesabe.service"));
const couponService = __importStar(require("./coupon.service"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function guestCheckout({ courseId, fullName, email, phone, couponCode }) {
    // Find or create a STUDENT account for this email
    const existing = await pool_1.default.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()]);
    let user;
    if (existing.rows.length > 0) {
        user = existing.rows[0];
        // Update phone if provided and not already stored
        if (phone && !user.phone) {
            await pool_1.default.query('UPDATE users SET phone=$1 WHERE id=$2', [phone, user.id]);
        }
    }
    else {
        const hash = await bcryptjs_1.default.hash(Math.random().toString(36) + Date.now(), 10);
        const { rows } = await pool_1.default.query(`INSERT INTO users (email, password_hash, full_name, role, phone) VALUES ($1, $2, $3, 'STUDENT', $4) RETURNING *`, [email.toLowerCase().trim(), hash, fullName, phone ?? null]);
        user = rows[0];
    }
    return initiateCheckout(user.id, courseId, couponCode);
}
async function initiateCheckout(userId, courseId, couponCode) {
    // Check course exists and is published
    const courseResult = await pool_1.default.query(`SELECT * FROM courses WHERE id = $1 AND status = 'published'`, [courseId]);
    if (courseResult.rows.length === 0) {
        throw { status: 404, message: 'Course not found or not available' };
    }
    const course = courseResult.rows[0];
    // Check if already enrolled
    const existingEnrollment = await pool_1.default.query(`SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2 AND status = 'active'`, [userId, courseId]);
    if (existingEnrollment.rows.length > 0) {
        throw { status: 409, message: 'Already enrolled in this course' };
    }
    let effectivePrice = parseFloat(course.price) * (1 - course.discount_percent / 100);
    let couponId = null;
    let couponDiscount = 0;
    if (couponCode) {
        const couponResult = await couponService.validateCoupon(couponCode, courseId, effectivePrice);
        if (couponResult.valid && couponResult.couponId) {
            couponId = couponResult.couponId;
            couponDiscount = couponResult.discountAmount ?? 0;
            effectivePrice = couponResult.finalAmount ?? effectivePrice;
        }
    }
    // Create pending enrollment
    const enrollmentResult = await pool_1.default.query(`INSERT INTO enrollments (user_id, course_id, status)
     VALUES ($1, $2, 'pending')
     ON CONFLICT (user_id, course_id) DO UPDATE SET status = 'pending'
     RETURNING *`, [userId, courseId]);
    const enrollment = enrollmentResult.rows[0];
    // Create pending payment
    const paymentResult = await pool_1.default.query(`INSERT INTO payments (enrollment_id, user_id, course_id, amount, currency, status, coupon_id, coupon_discount)
     VALUES ($1, $2, $3, $4, 'KWD', 'pending', $5, $6)
     RETURNING *`, [enrollment.id, userId, courseId, effectivePrice, couponId, couponDiscount]);
    const payment = paymentResult.rows[0];
    // Track coupon usage after payment record is created
    if (couponId) {
        await couponService.applyCoupon(couponId);
    }
    // If course is free, activate immediately
    if (effectivePrice === 0) {
        await pool_1.default.query(`UPDATE enrollments SET status = 'active', amount_paid = 0 WHERE id = $1`, [enrollment.id]);
        await pool_1.default.query(`UPDATE payments SET status = 'success' WHERE id = $1`, [payment.id]);
        await pool_1.default.query(`UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = $1`, [courseId]);
        return { free: true, courseTitle: course.title };
    }
    // Generate Hesabe payment URL
    const { paymentUrl } = hesabeService.createPaymentPayload({
        amount: effectivePrice,
        orderId: payment.id,
        userId,
        courseId,
    });
    // Update payment with hesabe order id
    await pool_1.default.query(`UPDATE payments SET hesabe_order_id = $1 WHERE id = $2`, [payment.id, payment.id]);
    return { free: false, paymentUrl, orderId: payment.id };
}
async function handleWebhook(encryptedData) {
    const response = hesabeService.decryptCallback(encryptedData);
    const { rows: paymentRows } = await pool_1.default.query(`SELECT * FROM payments WHERE id = $1`, [response.orderReferenceNumber]);
    if (paymentRows.length === 0) {
        throw new Error(`Payment not found: ${response.orderReferenceNumber}`);
    }
    const payment = paymentRows[0];
    if (hesabeService.isPaymentSuccessful(response)) {
        // Activate enrollment
        await pool_1.default.query(`UPDATE enrollments SET status = 'active', amount_paid = $1, enrolled_at = NOW()
       WHERE id = $2`, [payment.amount, payment.enrollment_id]);
        // Update payment
        await pool_1.default.query(`UPDATE payments SET
         status = 'success',
         hesabe_payment_id = $1,
         hesabe_result_code = $2,
         gateway_response = $3,
         updated_at = NOW()
       WHERE id = $4`, [response.paymentId, response.resultCode, JSON.stringify(response), payment.id]);
        // Increment course enrollment count
        await pool_1.default.query(`UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = $1`, [payment.course_id]);
    }
    else {
        // Mark payment failed
        await pool_1.default.query(`UPDATE payments SET
         status = 'failed',
         hesabe_result_code = $1,
         gateway_response = $2,
         updated_at = NOW()
       WHERE id = $3`, [response.resultCode, JSON.stringify(response), payment.id]);
        await pool_1.default.query(`UPDATE enrollments SET status = 'cancelled' WHERE id = $1`, [payment.enrollment_id]);
    }
    return response;
}
async function getUserEnrollments(userId) {
    const { rows } = await pool_1.default.query(`SELECT e.*, c.title, c.slug, c.thumbnail_url, c.category, c.level, c.duration
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = $1 AND e.status = 'active'
     ORDER BY e.enrolled_at DESC`, [userId]);
    return rows;
}
async function getAllEnrollments(filters) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 20);
    const offset = (page - 1) * limit;
    const conditions = ['1=1'];
    const params = [];
    let i = 0;
    if (filters.courseId) {
        i++;
        conditions.push(`e.course_id = $${i}`);
        params.push(filters.courseId);
    }
    if (filters.status) {
        i++;
        conditions.push(`e.status = $${i}`);
        params.push(filters.status);
    }
    const where = conditions.join(' AND ');
    const countResult = await pool_1.default.query(`SELECT COUNT(*) FROM enrollments e WHERE ${where}`, params);
    const total = parseInt(countResult.rows[0].count);
    params.push(limit, offset);
    const { rows } = await pool_1.default.query(`SELECT e.*, u.email, u.full_name, u.phone, c.title as course_title
     FROM enrollments e
     JOIN users u ON u.id = e.user_id
     JOIN courses c ON c.id = e.course_id
     WHERE ${where}
     ORDER BY e.enrolled_at DESC
     LIMIT $${i + 1} OFFSET $${i + 2}`, params);
    return {
        data: rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}
//# sourceMappingURL=enrollments.service.js.map