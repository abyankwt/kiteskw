"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pool_1 = __importDefault(require("../db/pool"));
const router = (0, express_1.Router)();
// Public: track frontend events (page views, clicks, etc.)
router.post('/event', async (req, res) => {
    try {
        const { eventType, sessionId, properties } = req.body;
        if (!eventType)
            return res.status(400).json({ error: 'eventType required' });
        const userId = req.user?.id ?? null;
        const ip = req.ip || req.socket.remoteAddress || null;
        await pool_1.default.query(`INSERT INTO analytics_events (event_type, user_id, session_id, properties)
       VALUES ($1, $2, $3, $4)`, [eventType, userId, sessionId ?? null, { ...(properties ?? {}), ip }]);
        res.json({ ok: true });
    }
    catch {
        // Never fail the client on tracking errors
        res.json({ ok: true });
    }
});
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map