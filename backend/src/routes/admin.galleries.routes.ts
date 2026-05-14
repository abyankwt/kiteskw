import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requirePermission } from '../middleware/rbac';
import * as galleryService from '../services/gallery.service';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/', requirePermission('gallery:read'), async (req, res, next) => {
  try {
    res.json(await galleryService.listGalleries(false));
  } catch (err) { next(err); }
});

router.get('/:id', requirePermission('gallery:read'), async (req, res, next) => {
  try {
    res.json(await galleryService.getGallery(req.params.id));
  } catch (err) { next(err); }
});

router.post('/', requirePermission('gallery:write'), async (req, res, next) => {
  try {
    const gallery = await galleryService.createGallery(req.body, (req as any).user.id);
    res.status(201).json(gallery);
  } catch (err) { next(err); }
});

router.patch('/:id', requirePermission('gallery:write'), async (req, res, next) => {
  try {
    res.json(await galleryService.updateGallery(req.params.id, req.body));
  } catch (err) { next(err); }
});

router.delete('/:id', requirePermission('gallery:delete'), async (req, res, next) => {
  try {
    await galleryService.deleteGallery(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// Gallery items
router.post('/:id/items', requirePermission('gallery:write'), async (req, res, next) => {
  try {
    const { mediaId, caption } = req.body;
    if (!mediaId) return res.status(400).json({ error: 'mediaId required' });
    res.status(201).json(await galleryService.addGalleryItem(req.params.id, mediaId, caption));
  } catch (err) { next(err); }
});

router.delete('/:galleryId/items/:itemId', requirePermission('gallery:write'), async (req, res, next) => {
  try {
    await galleryService.removeGalleryItem(req.params.itemId);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.post('/:id/items/reorder', requirePermission('gallery:write'), async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    await galleryService.reorderGalleryItems(req.params.id, orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
