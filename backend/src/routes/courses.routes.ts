import { Router } from 'express';
import * as ctrl from '../controllers/courses.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public
router.get('/', ctrl.listPublished);
router.get('/:slug', ctrl.getBySlug);
router.post('/:id/view', ctrl.recordView);

export default router;
