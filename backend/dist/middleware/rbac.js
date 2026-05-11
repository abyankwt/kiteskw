"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdminOrAbove = exports.requireSuperAdmin = exports.requireAdmin = void 0;
exports.requirePermission = requirePermission;
exports.requireRole = requireRole;
// Permission-based guard (preferred — fine-grained)
function requirePermission(key) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!req.user.permissions.includes(key)) {
            return res.status(403).json({ error: 'Insufficient permissions', required: key });
        }
        next();
    };
}
// Role-based guard (kept for backwards compatibility with existing routes)
function requireRole(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
}
exports.requireAdmin = requireRole(['SUPER_ADMIN', 'ADMIN', 'STAFF']);
exports.requireSuperAdmin = requireRole(['SUPER_ADMIN']);
exports.requireAdminOrAbove = requireRole(['SUPER_ADMIN', 'ADMIN']);
//# sourceMappingURL=rbac.js.map