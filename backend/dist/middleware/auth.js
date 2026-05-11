"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = authenticateToken;
exports.optionalAuth = optionalAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../config/jwt");
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.accessSecret);
        req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role,
            fullName: payload.fullName,
            permissions: Array.isArray(payload.permissions) ? payload.permissions : [],
        };
        next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid or expired access token' });
    }
}
function optionalAuth(req, _res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, jwt_1.jwtConfig.accessSecret);
            req.user = {
                id: payload.id,
                email: payload.email,
                role: payload.role,
                fullName: payload.fullName,
                permissions: Array.isArray(payload.permissions) ? payload.permissions : [],
            };
        }
        catch {
            // token invalid — treat as anonymous
        }
    }
    next();
}
//# sourceMappingURL=auth.js.map