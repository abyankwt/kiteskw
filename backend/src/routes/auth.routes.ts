import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth';
import { requireSuperAdmin } from '../middleware/rbac';

const router = Router();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/me', authenticateToken, authController.me);
router.post('/register', authenticateToken, requireSuperAdmin, authController.register);
router.patch('/change-password', authenticateToken, authController.changePassword);

export default router;
