import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requirePermission } from '../middleware/rbac';
import * as blogService from '../services/blog.service';
import * as testimonialsService from '../services/testimonials.service';

const router = Router();
router.use(authenticateToken, requireAdmin);

// ── Blog Posts ──────────────────────────────────────────────────────────────
router.get('/posts', requirePermission('blog:read'), async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    res.json(await blogService.listPosts(false, page, limit));
  } catch (err) { next(err); }
});

router.post('/posts', requirePermission('blog:write'), async (req, res, next) => {
  try {
    const post = await blogService.createPost(req.body, (req as any).user.id);
    res.status(201).json(post);
  } catch (err) { next(err); }
});

router.patch('/posts/:id', requirePermission('blog:write'), async (req, res, next) => {
  try {
    res.json(await blogService.updatePost(req.params.id, req.body));
  } catch (err) { next(err); }
});

router.post('/posts/:id/publish', requirePermission('blog:write'), async (req, res, next) => {
  try {
    res.json(await blogService.publishPost(req.params.id));
  } catch (err) { next(err); }
});

router.post('/posts/:id/unpublish', requirePermission('blog:write'), async (req, res, next) => {
  try {
    res.json(await blogService.unpublishPost(req.params.id));
  } catch (err) { next(err); }
});

router.delete('/posts/:id', requirePermission('blog:delete'), async (req, res, next) => {
  try {
    await blogService.deletePost(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

// ── Testimonials ────────────────────────────────────────────────────────────
router.get('/testimonials', requirePermission('blog:read'), async (req, res, next) => {
  try {
    res.json(await testimonialsService.listTestimonials(false));
  } catch (err) { next(err); }
});

router.post('/testimonials', requirePermission('blog:write'), async (req, res, next) => {
  try {
    res.status(201).json(await testimonialsService.createTestimonial(req.body));
  } catch (err) { next(err); }
});

router.patch('/testimonials/:id', requirePermission('blog:write'), async (req, res, next) => {
  try {
    res.json(await testimonialsService.updateTestimonial(req.params.id, req.body));
  } catch (err) { next(err); }
});

router.delete('/testimonials/:id', requirePermission('blog:delete'), async (req, res, next) => {
  try {
    await testimonialsService.deleteTestimonial(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.post('/testimonials/reorder', requirePermission('blog:write'), async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    await testimonialsService.reorderTestimonials(orderedIds);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
