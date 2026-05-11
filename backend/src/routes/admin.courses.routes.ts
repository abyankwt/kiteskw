import { Router } from 'express';
import * as ctrl from '../controllers/courses.controller';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requireSuperAdmin } from '../middleware/rbac';
import { upload } from '../config/multer';

const router = Router();

router.use(authenticateToken, requireAdmin);

router.get('/', ctrl.listAll);
router.post('/', upload.single('thumbnail'), ctrl.create);
router.patch('/:id', upload.single('thumbnail'), ctrl.update);
router.delete('/:id', requireSuperAdmin, ctrl.deleteCourse);
router.post('/:id/publish', ctrl.publish);
router.post('/:id/unpublish', ctrl.unpublish);
router.patch('/:id/featured', ctrl.setFeatured);
router.post('/featured/reorder', ctrl.reorderFeatured);

export default router;
