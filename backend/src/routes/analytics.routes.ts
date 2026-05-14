import { Router } from 'express';
import pool from '../db/pool';

const router = Router();

// Public: track frontend events (page views, clicks, etc.)
router.post('/event', async (req, res) => {
  try {
    const { eventType, sessionId, properties } = req.body;
    if (!eventType) return res.status(400).json({ error: 'eventType required' });

    const userId = (req as any).user?.id ?? null;
    const ip = req.ip || req.socket.remoteAddress || null;

    await pool.query(
      `INSERT INTO analytics_events (event_type, user_id, session_id, properties)
       VALUES ($1, $2, $3, $4)`,
      [eventType, userId, sessionId ?? null, { ...(properties ?? {}), ip }]
    );
    res.json({ ok: true });
  } catch {
    // Never fail the client on tracking errors
    res.json({ ok: true });
  }
});

export default router;
