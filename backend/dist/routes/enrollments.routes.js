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
const enrollmentsService = __importStar(require("../services/enrollments.service"));
const router = (0, express_1.Router)();
// Guest checkout — no login required
router.post('/guest', async (req, res, next) => {
    try {
        const { courseId, fullName, email, phone } = req.body;
        if (!courseId || !fullName || !email) {
            return res.status(400).json({ error: 'courseId, fullName, and email are required' });
        }
        const result = await enrollmentsService.guestCheckout({ courseId, fullName, email, phone });
        if (result.free) {
            return res.json({ free: true, message: result.message });
        }
        res.json({ paymentUrl: result.paymentUrl, orderId: result.orderId });
    }
    catch (err) {
        next(err);
    }
});
router.post('/checkout', auth_1.authenticateToken, async (req, res, next) => {
    try {
        const { courseId } = req.body;
        if (!courseId)
            return res.status(400).json({ error: 'courseId is required' });
        const result = await enrollmentsService.initiateCheckout(req.user.id, courseId);
        if (result.free) {
            return res.json({ free: true, message: `Enrolled in ${result.courseTitle}` });
        }
        res.json({ paymentUrl: result.paymentUrl, orderId: result.orderId });
    }
    catch (err) {
        next(err);
    }
});
router.get('/my', auth_1.authenticateToken, async (req, res, next) => {
    try {
        const enrollments = await enrollmentsService.getUserEnrollments(req.user.id);
        res.json(enrollments);
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=enrollments.routes.js.map