import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';
import * as analyticsService from '../services/analytics.service';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/overview', async (_req, res, next) => {
  try {
    const data = await analyticsService.getOverview();
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/enrollments', async (req, res, next) => {
  try {
    const from = (req.query.from as string) || new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0];
    const to = (req.query.to as string) || new Date().toISOString().split('T')[0];
    const groupBy = (req.query.groupBy as any) || 'day';
    const data = await analyticsService.getEnrollmentsOverTime(from, to, groupBy);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/top-courses', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await analyticsService.getTopCourses(limit);
    res.json(data);
  } catch (err) { next(err); }
});

router.get('/revenue', async (_req, res, next) => {
  try {
    const data = await analyticsService.getRevenueByCategory();
    res.json(data);
  } catch (err) { next(err); }
});

export default router;
