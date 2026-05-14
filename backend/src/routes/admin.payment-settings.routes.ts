import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { requireAdmin, requirePermission } from '../middleware/rbac';
import { hesabeConfig } from '../config/hesabe';
import * as hesabeService from '../services/hesabe.service';

const router = Router();
router.use(authenticateToken, requireAdmin);

function mask(val: string | undefined): string {
  if (!val) return '';
  if (val.length <= 8) return '****';
  return val.slice(0, 4) + '****' + val.slice(-4);
}

router.get('/', requirePermission('payment:settings'), async (_req, res) => {
  const isProduction = !hesabeConfig.paymentUrl.includes('sandbox');
  res.json({
    merchantCode: mask(hesabeConfig.merchantCode),
    merchantCodeSet: !!hesabeConfig.merchantCode,
    secretKeySet: !!hesabeConfig.secretKey,
    secretKeyLength: hesabeConfig.secretKey?.length ?? 0,
    accessCodeSet: !!hesabeConfig.accessCode,
    ivSet: !!hesabeConfig.iv,
    ivLength: hesabeConfig.iv?.length ?? 0,
    paymentUrl: hesabeConfig.paymentUrl,
    mode: isProduction ? 'production' : 'sandbox',
  });
});

router.post('/test', requirePermission('payment:settings'), async (_req, res) => {
  try {
    // Create a minimal test payload — Hesabe will reject it (no real order)
    // but we can detect auth errors (422) vs connectivity errors (network fail)
    const { paymentUrl } = hesabeService.createPaymentPayload({
      amount: 1,
      orderId: '00000000-0000-0000-0000-000000000001',
      userId: 'test',
      courseId: 'test',
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(paymentUrl, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (response.status === 422) {
        res.json({
          success: false,
          message: 'Hesabe reached but rejected the request (422 Invalid Input) — credentials likely incorrect',
          httpStatus: 422,
        });
      } else {
        res.json({
          success: true,
          message: `Hesabe responded with HTTP ${response.status} — gateway is reachable`,
          httpStatus: response.status,
        });
      }
    } catch (fetchErr: any) {
      clearTimeout(timeout);
      if (fetchErr.name === 'AbortError') {
        res.json({ success: false, message: 'Connection timed out — Hesabe unreachable' });
      } else {
        res.json({ success: false, message: `Connection failed: ${fetchErr.message}` });
      }
    }
  } catch (err: any) {
    res.json({ success: false, message: `Encryption error: ${err.message}` });
  }
});

export default router;
