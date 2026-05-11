import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import { upload } from '../config/multer';
import * as ctrl from '../controllers/media.controller';

const router = Router();

router.post('/', authenticateToken, requirePermission('media:upload'), upload.single('file'), ctrl.uploadMedia);
router.get('/', authenticateToken, requirePermission('cms:read'), ctrl.listMedia);
router.patch('/:id', authenticateToken, requirePermission('cms:edit'), ctrl.updateAltText);
router.delete('/:id', authenticateToken, requirePermission('media:delete'), ctrl.deleteMedia);

export default router;
