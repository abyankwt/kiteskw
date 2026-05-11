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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const rbac = __importStar(require("../services/rbac.service"));
const router = (0, express_1.Router)();
const guard = [auth_1.authenticateToken, (0, rbac_1.requirePermission)('roles:manage')];
// Permissions catalog
router.get('/permissions', auth_1.authenticateToken, (0, rbac_1.requirePermission)('roles:manage'), async (_req, res) => {
    try {
        const perms = await rbac.getAllPermissions();
        res.json({ data: perms });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});
// Roles CRUD
router.get('/roles', ...guard, async (_req, res) => {
    try {
        res.json({ data: await rbac.getRoles() });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});
router.post('/roles', ...guard, async (req, res) => {
    try {
        const { name, display_name, description } = req.body;
        if (!name || !display_name)
            return res.status(400).json({ error: 'name and display_name are required' });
        const role = await rbac.createRole(name, display_name, description);
        res.status(201).json({ data: role });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});
router.patch('/roles/:id', ...guard, async (req, res) => {
    try {
        const { display_name, description } = req.body;
        const role = await rbac.updateRole(req.params.id, display_name, description);
        res.json({ data: role });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});
router.delete('/roles/:id', ...guard, async (req, res) => {
    try {
        await rbac.deleteRole(req.params.id);
        res.json({ message: 'Role deleted' });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});
// Assign/remove permissions from a role
router.put('/roles/:id/permissions', ...guard, async (req, res) => {
    try {
        const { permission_keys } = req.body;
        if (!Array.isArray(permission_keys))
            return res.status(400).json({ error: 'permission_keys must be an array' });
        await rbac.setRolePermissions(req.params.id, permission_keys);
        res.json({ message: 'Permissions updated' });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});
// User role management
router.get('/users/:userId/roles', ...guard, async (req, res) => {
    try {
        res.json({ data: await rbac.getUserRoles(req.params.userId) });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});
router.post('/users/:userId/roles', ...guard, async (req, res) => {
    try {
        const { role_id } = req.body;
        if (!role_id)
            return res.status(400).json({ error: 'role_id is required' });
        await rbac.assignRoleToUser(req.params.userId, role_id, req.user.id);
        res.json({ message: 'Role assigned' });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});
router.delete('/users/:userId/roles/:roleId', ...guard, async (req, res) => {
    try {
        await rbac.removeRoleFromUser(req.params.userId, req.params.roleId);
        res.json({ message: 'Role removed' });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
});
exports.default = router;
//# sourceMappingURL=admin.rbac.routes.js.map