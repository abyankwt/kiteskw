import { Router } from 'express';
import * as couponService from '../services/coupon.service';

const router = Router();

// Public: validate a coupon code
router.post('/validate', async (req, res, next) => {
  try {
    const { code, courseId, amount } = req.body;
    if (!code || !courseId || amount === undefined) {
      return res.status(400).json({ error: 'code, courseId, and amount are required' });
    }
    const result = await couponService.validateCoupon(code, courseId, parseFloat(amount));
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
