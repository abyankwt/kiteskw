import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import * as rbac from '../services/rbac.service';

const router = Router();
const guard = [authenticateToken, requirePermission('roles:manage')];

// Permissions catalog
router.get('/permissions', authenticateToken, requirePermission('roles:manage'), async (_req: Request, res: Response) => {
  try {
    const perms = await rbac.getAllPermissions();
    res.json({ data: perms });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Roles CRUD
router.get('/roles', ...guard, async (_req: Request, res: Response) => {
  try {
    res.json({ data: await rbac.getRoles() });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/roles', ...guard, async (req: Request, res: Response) => {
  try {
    const { name, display_name, description } = req.body;
    if (!name || !display_name) return res.status(400).json({ error: 'name and display_name are required' });
    const role = await rbac.createRole(name, display_name, description);
    res.status(201).json({ data: role });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.patch('/roles/:id', ...guard, async (req: Request, res: Response) => {
  try {
    const { display_name, description } = req.body;
    const role = await rbac.updateRole(req.params.id, display_name, description);
    res.json({ data: role });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/roles/:id', ...guard, async (req: Request, res: Response) => {
  try {
    await rbac.deleteRole(req.params.id);
    res.json({ message: 'Role deleted' });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// Assign/remove permissions from a role
router.put('/roles/:id/permissions', ...guard, async (req: Request, res: Response) => {
  try {
    const { permission_keys } = req.body;
    if (!Array.isArray(permission_keys)) return res.status(400).json({ error: 'permission_keys must be an array' });
    await rbac.setRolePermissions(req.params.id, permission_keys);
    res.json({ message: 'Permissions updated' });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// User role management
router.get('/users/:userId/roles', ...guard, async (req: Request, res: Response) => {
  try {
    res.json({ data: await rbac.getUserRoles(req.params.userId) });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.post('/users/:userId/roles', ...guard, async (req: Request, res: Response) => {
  try {
    const { role_id } = req.body;
    if (!role_id) return res.status(400).json({ error: 'role_id is required' });
    await rbac.assignRoleToUser(req.params.userId, role_id, req.user!.id);
    res.json({ message: 'Role assigned' });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

router.delete('/users/:userId/roles/:roleId', ...guard, async (req: Request, res: Response) => {
  try {
    await rbac.removeRoleFromUser(req.params.userId, req.params.roleId);
    res.json({ message: 'Role removed' });
  } catch (err: any) {
    res.status(err.status || 500).json({ error: err.message });
  }
});

export default router;
