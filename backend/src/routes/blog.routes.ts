import { Router } from 'express';
import * as blogService from '../services/blog.service';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const category = req.query.category as string | undefined;
    res.json(await blogService.listPosts(true, page, limit, category));
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    res.json(await blogService.getPostBySlug(req.params.slug));
  } catch (err) { next(err); }
});

export default router;
