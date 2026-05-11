"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = loginUser;
exports.refreshAccessToken = refreshAccessToken;
exports.createUser = createUser;
exports.changePassword = changePassword;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const pool_1 = __importDefault(require("../db/pool"));
const jwt_1 = require("../config/jwt");
const helpers_1 = require("../utils/helpers");
const rbac_service_1 = require("./rbac.service");
function buildAccessToken(user, permissions) {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role, fullName: user.full_name, permissions }, jwt_1.jwtConfig.accessSecret, { expiresIn: jwt_1.jwtConfig.accessExpiresIn });
}
function buildRefreshToken(userId) {
    return jsonwebtoken_1.default.sign({ id: userId }, jwt_1.jwtConfig.refreshSecret, {
        expiresIn: jwt_1.jwtConfig.refreshExpiresIn,
    });
}
async function loginUser(email, password) {
    const { rows } = await pool_1.default.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email.toLowerCase().trim()]);
    if (rows.length === 0)
        throw { status: 401, message: 'Invalid email or password' };
    const user = rows[0];
    const valid = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!valid)
        throw { status: 401, message: 'Invalid email or password' };
    const permissions = await (0, rbac_service_1.getUserPermissions)(user.id);
    const accessToken = buildAccessToken(user, permissions);
    const refreshToken = buildRefreshToken(user.id);
    return { accessToken, refreshToken, user: (0, helpers_1.formatUser)(user), permissions };
}
async function refreshAccessToken(refreshToken) {
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(refreshToken, jwt_1.jwtConfig.refreshSecret);
    }
    catch {
        throw { status: 401, message: 'Invalid or expired refresh token' };
    }
    const { rows } = await pool_1.default.query('SELECT * FROM users WHERE id = $1 AND is_active = true', [payload.id]);
    if (rows.length === 0)
        throw { status: 401, message: 'User not found' };
    const user = rows[0];
    const permissions = await (0, rbac_service_1.getUserPermissions)(user.id);
    const newAccessToken = buildAccessToken(user, permissions);
    const newRefreshToken = buildRefreshToken(user.id);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken, user: (0, helpers_1.formatUser)(user), permissions };
}
async function createUser(email, password, fullName, role) {
    const existing = await pool_1.default.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0)
        throw { status: 409, message: 'Email already in use' };
    const hash = await bcryptjs_1.default.hash(password, 12);
    const { rows } = await pool_1.default.query(`INSERT INTO users (email, password_hash, full_name, role)
     VALUES ($1, $2, $3, $4) RETURNING *`, [email.toLowerCase().trim(), hash, fullName, role]);
    return (0, helpers_1.formatUser)(rows[0]);
}
async function changePassword(userId, currentPassword, newPassword) {
    const { rows } = await pool_1.default.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (rows.length === 0)
        throw { status: 404, message: 'User not found' };
    const valid = await bcryptjs_1.default.compare(currentPassword, rows[0].password_hash);
    if (!valid)
        throw { status: 401, message: 'Current password is incorrect' };
    const hash = await bcryptjs_1.default.hash(newPassword, 12);
    await pool_1.default.query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [hash, userId]);
}
//# sourceMappingURL=auth.service.js.map