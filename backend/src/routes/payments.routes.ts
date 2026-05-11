import { Router } from 'express';
import * as enrollmentsService from '../services/enrollments.service';

const router = Router();

const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:8080';

// ── Hesabe browser redirect after successful payment ─────────────────
// Hesabe redirects the user's browser here (GET) with encrypted `data`
router.get('/callback', async (req, res) => {
  try {
    const encryptedData = req.query.data as string;
    if (!encryptedData) {
      return res.redirect(`${frontendUrl()}/payment/failure`);
    }

    const result = await enrollmentsService.handleWebhook(encryptedData);

    if (result.status === true && result.resultCode === '0') {
      res.redirect(`${frontendUrl()}/payment/success?orderId=${result.orderReferenceNumber}`);
    } else {
      res.redirect(`${frontendUrl()}/payment/failure?orderId=${result.orderReferenceNumber}&code=${result.resultCode}`);
    }
  } catch (err) {
    console.error('Payment callback error:', err);
    res.redirect(`${frontendUrl()}/payment/failure`);
  }
});

// ── Hesabe failure redirect ───────────────────────────────────────────
router.get('/failure-callback', (req, res) => {
  const orderId = req.query.orderId || '';
  res.redirect(`${frontendUrl()}/payment/failure?orderId=${orderId}`);
});

// ── Server-to-server webhook (keep for optional Hesabe portal config) ─
router.post('/webhook', async (req, res) => {
  try {
    const encryptedData = req.body.data || req.query.data;
    if (!encryptedData) return res.status(400).json({ error: 'Missing payment data' });
    await enrollmentsService.handleWebhook(encryptedData as string);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    res.json({ status: 'error', message: String(err) });
  }
});

export default router;
