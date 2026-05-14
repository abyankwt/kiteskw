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
const galleryService = __importStar(require("../services/gallery.service"));
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken, rbac_1.requireAdmin);
router.get('/', (0, rbac_1.requirePermission)('gallery:read'), async (req, res, next) => {
    try {
        res.json(await galleryService.listGalleries(false));
    }
    catch (err) {
        next(err);
    }
});
router.get('/:id', (0, rbac_1.requirePermission)('gallery:read'), async (req, res, next) => {
    try {
        res.json(await galleryService.getGallery(req.params.id));
    }
    catch (err) {
        next(err);
    }
});
router.post('/', (0, rbac_1.requirePermission)('gallery:write'), async (req, res, next) => {
    try {
        const gallery = await galleryService.createGallery(req.body, req.user.id);
        res.status(201).json(gallery);
    }
    catch (err) {
        next(err);
    }
});
router.patch('/:id', (0, rbac_1.requirePermission)('gallery:write'), async (req, res, next) => {
    try {
        res.json(await galleryService.updateGallery(req.params.id, req.body));
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:id', (0, rbac_1.requirePermission)('gallery:delete'), async (req, res, next) => {
    try {
        await galleryService.deleteGallery(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
// Gallery items
router.post('/:id/items', (0, rbac_1.requirePermission)('gallery:write'), async (req, res, next) => {
    try {
        const { mediaId, caption } = req.body;
        if (!mediaId)
            return res.status(400).json({ error: 'mediaId required' });
        res.status(201).json(await galleryService.addGalleryItem(req.params.id, mediaId, caption));
    }
    catch (err) {
        next(err);
    }
});
router.delete('/:galleryId/items/:itemId', (0, rbac_1.requirePermission)('gallery:write'), async (req, res, next) => {
    try {
        await galleryService.removeGalleryItem(req.params.itemId);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
router.post('/:id/items/reorder', (0, rbac_1.requirePermission)('gallery:write'), async (req, res, next) => {
    try {
        const { orderedIds } = req.body;
        await galleryService.reorderGalleryItems(req.params.id, orderedIds);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
});
exports.default = router;
//# sourceMappingURL=admin.galleries.routes.js.map