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
exports.listPages = listPages;
exports.getPage = getPage;
exports.publishPage = publishPage;
exports.unpublishPage = unpublishPage;
exports.updatePageMeta = updatePageMeta;
exports.toggleSection = toggleSection;
exports.getSectionBlocks = getSectionBlocks;
exports.updateBlock = updateBlock;
exports.getBlockHistory = getBlockHistory;
exports.revertBlock = revertBlock;
const cmsService = __importStar(require("../services/cms.service"));
async function listPages(req, res) {
    try {
        const pages = await cmsService.getPages();
        res.json({ data: pages });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
async function getPage(req, res) {
    try {
        const page = await cmsService.getPageBySlug(req.params.slug);
        res.json({ data: page });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
async function publishPage(req, res) {
    try {
        const page = await cmsService.publishPage(req.params.slug, req.user.id);
        res.json({ data: page });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
async function unpublishPage(req, res) {
    try {
        const page = await cmsService.unpublishPage(req.params.slug, req.user.id);
        res.json({ data: page });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
async function updatePageMeta(req, res) {
    try {
        const page = await cmsService.updatePageMeta(req.params.slug, req.user.id, req.body);
        res.json({ data: page });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
async function toggleSection(req, res) {
    try {
        const { is_visible } = req.body;
        if (typeof is_visible !== 'boolean') {
            return res.status(400).json({ error: 'is_visible must be a boolean' });
        }
        const section = await cmsService.toggleSection(req.params.id, is_visible);
        res.json({ data: section });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
async function getSectionBlocks(req, res) {
    try {
        const blocks = await cmsService.getSectionBlocks(req.params.id);
        res.json({ data: blocks });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
async function updateBlock(req, res) {
    try {
        const block = await cmsService.updateBlock(req.params.id, req.user.id, req.body);
        res.json({ data: block });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
async function getBlockHistory(req, res) {
    try {
        const history = await cmsService.getBlockHistory(req.params.id);
        res.json({ data: history });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
async function revertBlock(req, res) {
    try {
        const { revision_id } = req.body;
        if (!revision_id)
            return res.status(400).json({ error: 'revision_id is required' });
        const block = await cmsService.revertBlock(req.params.id, revision_id, req.user.id);
        res.json({ data: block });
    }
    catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
//# sourceMappingURL=cms.controller.js.map