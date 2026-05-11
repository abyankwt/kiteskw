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
const ctrl = __importStar(require("../controllers/cms.controller"));
const router = (0, express_1.Router)();
// Public — frontend fetches page content by slug
router.get('/pages/:slug', ctrl.getPage);
// Admin — require authentication + permission for all write operations
router.get('/pages', auth_1.authenticateToken, (0, rbac_1.requirePermission)('cms:read'), ctrl.listPages);
router.patch('/pages/:slug/meta', auth_1.authenticateToken, (0, rbac_1.requirePermission)('cms:edit'), ctrl.updatePageMeta);
router.post('/pages/:slug/publish', auth_1.authenticateToken, (0, rbac_1.requirePermission)('cms:publish'), ctrl.publishPage);
router.post('/pages/:slug/unpublish', auth_1.authenticateToken, (0, rbac_1.requirePermission)('cms:publish'), ctrl.unpublishPage);
router.patch('/sections/:id', auth_1.authenticateToken, (0, rbac_1.requirePermission)('cms:edit'), ctrl.toggleSection);
router.get('/sections/:id/blocks', auth_1.authenticateToken, (0, rbac_1.requirePermission)('cms:read'), ctrl.getSectionBlocks);
router.patch('/blocks/:id', auth_1.authenticateToken, (0, rbac_1.requirePermission)('cms:edit'), ctrl.updateBlock);
router.get('/blocks/:id/history', auth_1.authenticateToken, (0, rbac_1.requirePermission)('cms:read'), ctrl.getBlockHistory);
router.post('/blocks/:id/revert', auth_1.authenticateToken, (0, rbac_1.requirePermission)('cms:edit'), ctrl.revertBlock);
exports.default = router;
//# sourceMappingURL=cms.routes.js.map