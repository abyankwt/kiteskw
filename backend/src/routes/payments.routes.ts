import { Router } from 'express';
import * as enrollmentsService from '../services/enrollments.service';

const router = Router();

// Hesabe webhook — called by Hesabe servers after payment
router.post('/webhook', async (req, res, next) => {
  try {
    const encryptedData = req.body.data || req.query.data;
    if (!encryptedData) {
      return res.status(400).json({ error: 'Missing payment data' });
    }

    await enrollmentsService.handleWebhook(encryptedData as string);
    res.json({ status: 'ok' });
  } catch (err) {
    console.error('Webhook error:', err);
    // Return 200 to Hesabe even on error to prevent retries; log the failure
    res.json({ status: 'error', message: String(err) });
  }
});

// Browser redirects after payment
router.get('/success', (req, res) => {
  const orderId = req.query.orderId || '';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
  res.redirect(`${frontendUrl}/payment/success?orderId=${orderId}`);
});

router.get('/failure', (req, res) => {
  const orderId = req.query.orderId || '';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8080';
  res.redirect(`${frontendUrl}/payment/failure?orderId=${orderId}`);
});

export default router;
