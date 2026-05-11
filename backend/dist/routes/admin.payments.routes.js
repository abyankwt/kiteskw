"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const pool_1 = __importDefault(require("../db/pool"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken, rbac_1.requireAdmin);
router.get('/', async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, parseInt(req.query.limit) || 20);
        const offset = (page - 1) * limit;
        const status = req.query.status;
        const courseId = req.query.courseId;
        const search = req.query.search;
        const conditions = ['1=1'];
        const params = [];
        let i = 0;
        if (status) {
            i++;
            conditions.push(`p.status = $${i}`);
            params.push(status);
        }
        if (courseId) {
            i++;
            conditions.push(`p.course_id = $${i}`);
            params.push(courseId);
        }
        if (search) {
            i++;
            conditions.push(`(u.email ILIKE $${i} OR u.full_name ILIKE $${i} OR c.title ILIKE $${i})`);
            params.push(`%${search}%`);
        }
        const where = conditions.join(' AND ');
        const { rows: [{ count }] } = await pool_1.default.query(`SELECT COUNT(*) FROM payments p
       JOIN users u ON u.id = p.user_id
       JOIN courses c ON c.id = p.course_id
       WHERE ${where}`, params);
        params.push(limit, offset);
        const { rows } = await pool_1.default.query(`SELECT
         p.id, p.status, p.amount, p.currency,
         p.hesabe_payment_id, p.hesabe_result_code,
         p.created_at, p.updated_at,
         u.id   AS user_id,   u.full_name, u.email,
         c.id   AS course_id, c.title AS course_title,
         e.status AS enrollment_status
       FROM payments p
       JOIN users u ON u.id = p.user_id
       JOIN courses c ON c.id = p.course_id
       LEFT JOIN enrollments e ON e.id = p.enrollment_id
       WHERE ${where}
       ORDER BY p.created_at DESC
       LIMIT $${i + 1} OFFSET $${i + 2}`, params);
        res.json({
            data: rows,
            pagination: { page, limit, total: parseInt(count), totalPages: Math.ceil(parseInt(count) / limit) },
        });
    }
    catch (err) {
        next(err);
    }
});
// Summary stats for the payments dashboard card
router.get('/stats', async (_req, res, next) => {
    try {
        const { rows } = await pool_1.default.query(`
      SELECT
        COUNT(*)                                           AS total,
        COUNT(*) FILTER (WHERE status = 'success')        AS successful,
        COUNT(*) FILTER (WHERE status = 'pending')        AS pending,
        COUNT(*) FILTER (WHERE status = 'failed')         AS failed,
        COALESCE(SUM(amount) FILTER (WHERE status = 'success'), 0) AS total_revenue
      FROM payments
    `);
        res.json(rows[0]);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=admin.payments.routes.js.map