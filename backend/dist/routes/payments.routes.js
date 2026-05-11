"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enrollmentsService = __importStar(require("../services/enrollments.service"));
const router = (0, express_1.Router)();
const frontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:8080';
// ── Hesabe browser redirect after successful payment ─────────────────
// Hesabe redirects the user's browser here (GET) with encrypted `data`
router.get('/callback', async (req, res) => {
    try {
        const encryptedData = req.query.data;
        if (!encryptedData) {
            return res.redirect(`${frontendUrl()}/payment/failure`);
        }
        const result = await enrollmentsService.handleWebhook(encryptedData);
        if (result.status === true && result.resultCode === '0') {
            res.redirect(`${frontendUrl()}/payment/success?orderId=${result.orderReferenceNumber}`);
        }
        else {
            res.redirect(`${frontendUrl()}/payment/failure?orderId=${result.orderReferenceNumber}&code=${result.resultCode}`);
        }
    }
    catch (err) {
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
        if (!encryptedData)
            return res.status(400).json({ error: 'Missing payment data' });
        await enrollmentsService.handleWebhook(encryptedData);
        res.json({ status: 'ok' });
    }
    catch (err) {
        console.error('Webhook error:', err);
        res.json({ status: 'error', message: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=payments.routes.js.map