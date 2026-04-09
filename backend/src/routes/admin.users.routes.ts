import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requireSuperAdmin } from '../middleware/rbac';
import * as usersService from '../services/users.service';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const result = await usersService.listUsers({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      role: req.query.role as string,
      search: req.query.search as string,
    });
    res.json(result);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const user = await usersService.getUserById(req.params.id);
    res.json(user);
  } catch (err) { next(err); }
});

router.patch('/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    const { role, isActive } = req.body;
    const user = await usersService.updateUser(req.params.id, { role, isActive });
    res.json(user);
  } catch (err) { next(err); }
});

router.delete('/:id', requireSuperAdmin, async (req, res, next) => {
  try {
    await usersService.deactivateUser(req.params.id);
    res.json({ message: 'User deactivated' });
  } catch (err) { next(err); }
});

export default router;
