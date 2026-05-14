import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requirePermission } from '../middleware/rbac';
import * as couponService from '../services/coupon.service';

const router = Router();
router.use(authenticateToken, requireAdmin);

router.get('/', requirePermission('coupons:read'), async (req, res, next) => {
  try {
    res.json(await couponService.getCoupons());
  } catch (err) { next(err); }
});

router.post('/', requirePermission('coupons:write'), async (req, res, next) => {
  try {
    const coupon = await couponService.createCoupon(req.body, (req as any).user.id);
    res.status(201).json(coupon);
  } catch (err) { next(err); }
});

router.patch('/:id', requirePermission('coupons:write'), async (req, res, next) => {
  try {
    res.json(await couponService.updateCoupon(req.params.id, req.body));
  } catch (err) { next(err); }
});

router.delete('/:id', requirePermission('coupons:delete'), async (req, res, next) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
