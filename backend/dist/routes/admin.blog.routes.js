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
const blogService = __importStar(require("../services/blog.service"));
const testimonialsService = __importStar(require("../services/testimonials.service"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken, rbac_1.requireAdmin);
// ── Blog Posts ──────────────────────────────────────────────────────────────
router.get('/posts', (0, rbac_1.requirePermission)('blog:read'), async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        res.json(await blogService.listPosts(false, page, limit));
    }
    catch (err) {
        next(err);
    }
});
router.post('/posts', (0, rbac_1.requirePermission)('blog:write'), async (req, res, next) => {
    try {
        const post = await blogService.createPost(req.body, req.user.id);
        res.status(201).json(post);
    }
    catch (err) {
        next(err);
    }
});
router.patch('/posts/:id', (0, rbac_1.requirePermission)('blog:write'), async (req, res, next) => {
    try {
        res.json(await blogService.updatePost(req.params.id, req.body));
    }
    catch (err) {
        next(err);
    }
});
router.post('/posts/:id/publish', (0, rbac_1.requirePermission)('blog:write'), async (req, res, next) => {
    try {
        res.json(await blogService.publishPost(req.params.id));
    }
    catch (err) {
        next(err);
    }
});
router.post('/posts/:id/unpublish', (0, rbac_1.requirePermission)('blog:write'), async (req, res, next) => {
    try {
        res.json(await blogService.unpublishPost(req.params.id));
    }
    catch (err) {
        next(err);
    }
});
router.delete('/posts/:id', (0, rbac_1.requirePermission)('blog:delete'), async (req, res, next) => {
    try {
        await blogService.deletePost(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
// ── Testimonials ────────────────────────────────────────────────────────────
router.get('/testimonials', (0, rbac_1.requirePermission)('blog:read'), async (req, res, next) => {
    try {
        res.json(await testimonialsService.listTestimonials(false));
    }
    catch (err) {
        next(err);
    }
});
router.post('/testimonials', (0, rbac_1.requirePermission)('blog:write'), async (req, res, next) => {
    try {
        res.status(201).json(await testimonialsService.createTestimonial(req.body));
    }
    catch (err) {
        next(err);
    }
});
router.patch('/testimonials/:id', (0, rbac_1.requirePermission)('blog:write'), async (req, res, next) => {
    try {
        res.json(await testimonialsService.updateTestimonial(req.params.id, req.body));
    }
    catch (err) {
        next(err);
    }
});
router.delete('/testimonials/:id', (0, rbac_1.requirePermission)('blog:delete'), async (req, res, next) => {
    try {
        await testimonialsService.deleteTestimonial(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
router.post('/testimonials/reorder', (0, rbac_1.requirePermission)('blog:write'), async (req, res, next) => {
    try {
        const { orderedIds } = req.body;
        await testimonialsService.reorderTestimonials(orderedIds);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=admin.blog.routes.js.map