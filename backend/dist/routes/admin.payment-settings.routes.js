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
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const hesabe_1 = require("../config/hesabe");
const hesabeService = __importStar(require("../services/hesabe.service"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken, rbac_1.requireAdmin);
function mask(val) {
    if (!val)
        return '';
    if (val.length <= 8)
        return '****';
    return val.slice(0, 4) + '****' + val.slice(-4);
}
router.get('/', (0, rbac_1.requirePermission)('payment:settings'), async (_req, res) => {
    const isProduction = !hesabe_1.hesabeConfig.paymentUrl.includes('sandbox');
    res.json({
        merchantCode: mask(hesabe_1.hesabeConfig.merchantCode),
        merchantCodeSet: !!hesabe_1.hesabeConfig.merchantCode,
        secretKeySet: !!hesabe_1.hesabeConfig.secretKey,
        secretKeyLength: hesabe_1.hesabeConfig.secretKey?.length ?? 0,
        accessCodeSet: !!hesabe_1.hesabeConfig.accessCode,
        ivSet: !!hesabe_1.hesabeConfig.iv,
        ivLength: hesabe_1.hesabeConfig.iv?.length ?? 0,
        paymentUrl: hesabe_1.hesabeConfig.paymentUrl,
        mode: isProduction ? 'production' : 'sandbox',
    });
});
router.post('/test', (0, rbac_1.requirePermission)('payment:settings'), async (_req, res) => {
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
            }
            else {
                res.json({
                    success: true,
                    message: `Hesabe responded with HTTP ${response.status} — gateway is reachable`,
                    httpStatus: response.status,
                });
            }
        }
        catch (fetchErr) {
            clearTimeout(timeout);
            if (fetchErr.name === 'AbortError') {
                res.json({ success: false, message: 'Connection timed out — Hesabe unreachable' });
            }
            else {
                res.json({ success: false, message: `Connection failed: ${fetchErr.message}` });
            }
        }
    }
    catch (err) {
        res.json({ success: false, message: `Encryption error: ${err.message}` });
    }
});
exports.default = router;
//# sourceMappingURL=admin.payment-settings.routes.js.map