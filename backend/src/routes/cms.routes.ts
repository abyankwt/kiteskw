import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requirePermission } from '../middleware/rbac';
import * as ctrl from '../controllers/cms.controller';

const router = Router();

// Public — frontend fetches page content by slug
router.get('/pages/:slug', ctrl.getPage);

// Admin — require authentication + permission for all write operations
router.get('/pages', authenticateToken, requirePermission('cms:read'), ctrl.listPages);
router.patch('/pages/:slug/meta', authenticateToken, requirePermission('cms:edit'), ctrl.updatePageMeta);
router.post('/pages/:slug/publish', authenticateToken, requirePermission('cms:publish'), ctrl.publishPage);
router.post('/pages/:slug/unpublish', authenticateToken, requirePermission('cms:publish'), ctrl.unpublishPage);

router.patch('/sections/:id', authenticateToken, requirePermission('cms:edit'), ctrl.toggleSection);
router.get('/sections/:id/blocks', authenticateToken, requirePermission('cms:read'), ctrl.getSectionBlocks);

router.patch('/blocks/:id', authenticateToken, requirePermission('cms:edit'), ctrl.updateBlock);
router.get('/blocks/:id/history', authenticateToken, requirePermission('cms:read'), ctrl.getBlockHistory);
router.post('/blocks/:id/revert', authenticateToken, requirePermission('cms:edit'), ctrl.revertBlock);

export default router;
