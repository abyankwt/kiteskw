"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCoupons = getCoupons;
exports.createCoupon = createCoupon;
exports.updateCoupon = updateCoupon;
exports.deleteCoupon = deleteCoupon;
exports.validateCoupon = validateCoupon;
exports.applyCoupon = applyCoupon;
const pool_1 = __importDefault(require("../db/pool"));
async function getCoupons() {
    const { rows } = await pool_1.default.query(`SELECT id, code, description, discount_type, discount_value, min_order_amount,
            max_uses, used_count, expires_at, is_active, applicable_course_ids,
            created_at, updated_at
     FROM coupons
     ORDER BY created_at DESC`);
    return rows.map(formatCoupon);
}
async function createCoupon(dto, createdBy) {
    const { rows } = await pool_1.default.query(`INSERT INTO coupons
       (code, description, discount_type, discount_value, min_order_amount,
        max_uses, expires_at, is_active, applicable_course_ids, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     RETURNING *`, [
        dto.code.toUpperCase().trim(),
        dto.description || null,
        dto.discountType,
        dto.discountValue,
        dto.minOrderAmount ?? 0,
        dto.maxUses ?? null,
        dto.expiresAt ?? null,
        dto.isActive ?? true,
        dto.applicableCourseIds ?? null,
        createdBy,
    ]);
    return formatCoupon(rows[0]);
}
async function updateCoupon(id, dto) {
    const fields = [];
    const values = [];
    let i = 1;
    if (dto.code !== undefined) {
        fields.push(`code=$${i++}`);
        values.push(dto.code.toUpperCase().trim());
    }
    if (dto.description !== undefined) {
        fields.push(`description=$${i++}`);
        values.push(dto.description);
    }
    if (dto.discountType !== undefined) {
        fields.push(`discount_type=$${i++}`);
        values.push(dto.discountType);
    }
    if (dto.discountValue !== undefined) {
        fields.push(`discount_value=$${i++}`);
        values.push(dto.discountValue);
    }
    if (dto.minOrderAmount !== undefined) {
        fields.push(`min_order_amount=$${i++}`);
        values.push(dto.minOrderAmount);
    }
    if (dto.maxUses !== undefined) {
        fields.push(`max_uses=$${i++}`);
        values.push(dto.maxUses);
    }
    if (dto.expiresAt !== undefined) {
        fields.push(`expires_at=$${i++}`);
        values.push(dto.expiresAt);
    }
    if (dto.isActive !== undefined) {
        fields.push(`is_active=$${i++}`);
        values.push(dto.isActive);
    }
    if (dto.applicableCourseIds !== undefined) {
        fields.push(`applicable_course_ids=$${i++}`);
        values.push(dto.applicableCourseIds);
    }
    if (fields.length === 0)
        throw { status: 400, message: 'No fields to update' };
    fields.push(`updated_at=NOW()`);
    values.push(id);
    const { rows } = await pool_1.default.query(`UPDATE coupons SET ${fields.join(', ')} WHERE id=$${i} RETURNING *`, values);
    if (rows.length === 0)
        throw { status: 404, message: 'Coupon not found' };
    return formatCoupon(rows[0]);
}
async function deleteCoupon(id) {
    const { rowCount } = await pool_1.default.query('DELETE FROM coupons WHERE id=$1', [id]);
    if (rowCount === 0)
        throw { status: 404, message: 'Coupon not found' };
}
async function validateCoupon(code, courseId, amount) {
    const { rows } = await pool_1.default.query(`SELECT * FROM coupons WHERE code=$1`, [code.toUpperCase().trim()]);
    if (rows.length === 0)
        return { valid: false, message: 'Coupon not found' };
    const c = rows[0];
    if (!c.is_active)
        return { valid: false, message: 'Coupon is inactive' };
    if (c.expires_at && new Date(c.expires_at) < new Date())
        return { valid: false, message: 'Coupon has expired' };
    if (c.max_uses !== null && c.used_count >= c.max_uses)
        return { valid: false, message: 'Coupon usage limit reached' };
    if (amount < parseFloat(c.min_order_amount))
        return { valid: false, message: `Minimum order amount is KWD ${c.min_order_amount}` };
    if (c.applicable_course_ids !== null && !c.applicable_course_ids.includes(courseId)) {
        return { valid: false, message: 'Coupon is not applicable to this course' };
    }
    let discountAmount = 0;
    if (c.discount_type === 'percent') {
        discountAmount = parseFloat((amount * parseFloat(c.discount_value) / 100).toFixed(3));
    }
    else {
        discountAmount = Math.min(parseFloat(c.discount_value), amount);
    }
    return {
        valid: true,
        message: 'Coupon applied successfully',
        couponId: c.id,
        discountAmount,
        finalAmount: parseFloat((amount - discountAmount).toFixed(3)),
    };
}
async function applyCoupon(couponId) {
    await pool_1.default.query(`UPDATE coupons SET used_count = used_count + 1, updated_at = NOW() WHERE id=$1`, [couponId]);
}
function formatCoupon(row) {
    return {
        id: row.id,
        code: row.code,
        description: row.description,
        discountType: row.discount_type,
        discountValue: parseFloat(row.discount_value),
        minOrderAmount: parseFloat(row.min_order_amount),
        maxUses: row.max_uses,
        usedCount: row.used_count,
        expiresAt: row.expires_at,
        isActive: row.is_active,
        applicableCourseIds: row.applicable_course_ids,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
//# sourceMappingURL=coupon.service.js.map