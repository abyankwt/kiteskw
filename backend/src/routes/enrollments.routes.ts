import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import * as enrollmentsService from '../services/enrollments.service';

const router = Router();

// Guest checkout — no login required
router.post('/guest', async (req, res, next) => {
  try {
    const { courseId, fullName, email, phone } = req.body;
    if (!courseId || !fullName || !email) {
      return res.status(400).json({ error: 'courseId, fullName, and email are required' });
    }
    const result = await enrollmentsService.guestCheckout({ courseId, fullName, email, phone });
    if ((result as any).free) {
      return res.json({ free: true, message: (result as any).message });
    }
    res.json({ paymentUrl: (result as any).paymentUrl, orderId: (result as any).orderId });
  } catch (err) { next(err); }
});

router.post('/checkout', authenticateToken, async (req, res, next) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ error: 'courseId is required' });

    const result = await enrollmentsService.initiateCheckout(req.user!.id, courseId);

    if ((result as any).free) {
      return res.json({ free: true, message: `Enrolled in ${(result as any).courseTitle}` });
    }

    res.json({ paymentUrl: (result as any).paymentUrl, orderId: (result as any).orderId });
  } catch (err) { next(err); }
});

router.get('/my', authenticateToken, async (req, res, next) => {
  try {
    const enrollments = await enrollmentsService.getUserEnrollments(req.user!.id);
    res.json(enrollments);
  } catch (err) { next(err); }
});

export default router;
