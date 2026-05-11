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
const ctrl = __importStar(require("../controllers/courses.controller"));
const auth_1 = require("../middleware/auth");
const rbac_1 = require("../middleware/rbac");
const multer_1 = require("../config/multer");
const router = (0, express_1.Router)();
router.use(auth_1.authenticateToken, rbac_1.requireAdmin);
router.get('/', ctrl.listAll);
router.post('/', multer_1.upload.single('thumbnail'), ctrl.create);
router.patch('/:id', multer_1.upload.single('thumbnail'), ctrl.update);
router.delete('/:id', rbac_1.requireSuperAdmin, ctrl.deleteCourse);
router.post('/:id/publish', ctrl.publish);
router.post('/:id/unpublish', ctrl.unpublish);
router.patch('/:id/featured', ctrl.setFeatured);
router.post('/featured/reorder', ctrl.reorderFeatured);
exports.default = router;
//# sourceMappingURL=admin.courses.routes.js.map