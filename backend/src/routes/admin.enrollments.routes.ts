import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin } from '../middleware/rbac';
import * as enrollmentsService from '../services/enrollments.service';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/', async (req, res, next) => {
  try {
    const result = await enrollmentsService.getAllEnrollments({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 20,
      courseId: req.query.courseId as string,
      status: req.query.status as string,
    });
    res.json(result);
  } catch (err) { next(err); }
});

export default router;
