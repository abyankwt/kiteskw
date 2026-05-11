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
exports.listPublished = listPublished;
exports.getBySlug = getBySlug;
exports.recordView = recordView;
exports.listFeatured = listFeatured;
exports.listAll = listAll;
exports.create = create;
exports.update = update;
exports.deleteCourse = deleteCourse;
exports.publish = publish;
exports.unpublish = unpublish;
exports.setFeatured = setFeatured;
exports.reorderFeatured = reorderFeatured;
const coursesService = __importStar(require("../services/courses.service"));
async function listPublished(req, res, next) {
    try {
        const result = await coursesService.getPublishedCourses({
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            category: req.query.category,
            level: req.query.level,
            search: req.query.search,
        });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
async function getBySlug(req, res, next) {
    try {
        const course = await coursesService.getCourseBySlug(req.params.slug);
        res.json(course);
    }
    catch (err) {
        next(err);
    }
}
async function recordView(req, res, next) {
    try {
        await coursesService.recordView(req.params.id, req.user?.id, req.ip);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
}
async function listFeatured(req, res, next) {
    try {
        const courses = await coursesService.getFeaturedCourses();
        res.json(courses);
    }
    catch (err) {
        next(err);
    }
}
// Admin controllers
async function listAll(req, res, next) {
    try {
        const result = await coursesService.getAllCourses({
            page: parseInt(req.query.page) || 1,
            limit: parseInt(req.query.limit) || 20,
            category: req.query.category,
            level: req.query.level,
            status: req.query.status,
            search: req.query.search,
        });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
async function create(req, res, next) {
    try {
        const dto = {
            title: req.body.title,
            description: req.body.description,
            shortDesc: req.body.shortDesc,
            category: req.body.category,
            price: parseFloat(req.body.price) || 0,
            discountPercent: parseInt(req.body.discountPercent) || 0,
            duration: req.body.duration,
            level: req.body.level,
            instructor: req.body.instructor,
            tags: req.body.tags ? req.body.tags.split(',').map((t) => t.trim()) : [],
            certified: req.body.certified === 'true',
            color: req.body.color,
            status: req.body.status || 'draft',
        };
        if (!dto.title || !dto.category) {
            return res.status(400).json({ error: 'Title and category are required' });
        }
        // Handle thumbnail upload
        if (req.file) {
            dto.thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
        }
        const course = await coursesService.createCourse(dto, req.user.id);
        res.status(201).json(course);
    }
    catch (err) {
        next(err);
    }
}
async function update(req, res, next) {
    try {
        const dto = {};
        const fields = [
            'title', 'description', 'shortDesc', 'category', 'duration',
            'level', 'instructor', 'status', 'color',
        ];
        for (const f of fields) {
            if (req.body[f] !== undefined)
                dto[f] = req.body[f];
        }
        if (req.body.price !== undefined)
            dto.price = parseFloat(req.body.price);
        if (req.body.discountPercent !== undefined)
            dto.discountPercent = parseInt(req.body.discountPercent);
        if (req.body.certified !== undefined)
            dto.certified = req.body.certified === 'true' || req.body.certified === true;
        if (req.body.tags !== undefined) {
            dto.tags = typeof req.body.tags === 'string'
                ? req.body.tags.split(',').map((t) => t.trim())
                : req.body.tags;
        }
        if (req.file) {
            dto.thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
        }
        const course = await coursesService.updateCourse(req.params.id, dto);
        res.json(course);
    }
    catch (err) {
        next(err);
    }
}
async function deleteCourse(req, res, next) {
    try {
        await coursesService.deleteCourse(req.params.id);
        res.json({ message: 'Course archived' });
    }
    catch (err) {
        next(err);
    }
}
async function publish(req, res, next) {
    try {
        const course = await coursesService.publishCourse(req.params.id);
        res.json(course);
    }
    catch (err) {
        next(err);
    }
}
async function unpublish(req, res, next) {
    try {
        const course = await coursesService.unpublishCourse(req.params.id);
        res.json(course);
    }
    catch (err) {
        next(err);
    }
}
async function setFeatured(req, res, next) {
    try {
        const { featured, order } = req.body;
        const course = await coursesService.setFeatured(req.params.id, Boolean(featured), order);
        res.json(course);
    }
    catch (err) {
        next(err);
    }
}
async function reorderFeatured(req, res, next) {
    try {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds))
            return res.status(400).json({ error: 'orderedIds must be an array' });
        await coursesService.reorderFeatured(orderedIds);
        res.json({ success: true });
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=courses.controller.js.map