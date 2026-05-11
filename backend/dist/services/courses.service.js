"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublishedCourses = getPublishedCourses;
exports.getCourseBySlug = getCourseBySlug;
exports.getCourseById = getCourseById;
exports.recordView = recordView;
exports.getAllCourses = getAllCourses;
exports.createCourse = createCourse;
exports.updateCourse = updateCourse;
exports.deleteCourse = deleteCourse;
exports.publishCourse = publishCourse;
exports.unpublishCourse = unpublishCourse;
exports.getFeaturedCourses = getFeaturedCourses;
exports.setFeatured = setFeatured;
exports.reorderFeatured = reorderFeatured;
const pool_1 = __importDefault(require("../db/pool"));
const helpers_1 = require("../utils/helpers");
async function getPublishedCourses(filters) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 20);
    const offset = (page - 1) * limit;
    const conditions = ["status = 'published'"];
    const params = [];
    let paramCount = 0;
    if (filters.category) {
        paramCount++;
        conditions.push(`category = $${paramCount}`);
        params.push(filters.category);
    }
    if (filters.level) {
        paramCount++;
        conditions.push(`level = $${paramCount}`);
        params.push(filters.level);
    }
    if (filters.search) {
        paramCount++;
        conditions.push(`(title ILIKE $${paramCount} OR description ILIKE $${paramCount})`);
        params.push(`%${filters.search}%`);
    }
    const where = conditions.join(' AND ');
    const countResult = await pool_1.default.query(`SELECT COUNT(*) FROM courses WHERE ${where}`, params);
    const total = parseInt(countResult.rows[0].count);
    params.push(limit, offset);
    const { rows } = await pool_1.default.query(`SELECT * FROM courses WHERE ${where}
     ORDER BY enrollment_count DESC, created_at DESC
     LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`, params);
    return {
        data: rows.map(helpers_1.formatCourse),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}
async function getCourseBySlug(slug) {
    const { rows } = await pool_1.default.query('SELECT * FROM courses WHERE slug = $1', [slug]);
    if (rows.length === 0)
        throw { status: 404, message: 'Course not found' };
    return (0, helpers_1.formatCourse)(rows[0]);
}
async function getCourseById(id) {
    const { rows } = await pool_1.default.query('SELECT * FROM courses WHERE id = $1', [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Course not found' };
    return (0, helpers_1.formatCourse)(rows[0]);
}
async function recordView(courseId, userId, ip) {
    await pool_1.default.query('INSERT INTO course_views (course_id, user_id, ip_address) VALUES ($1, $2, $3)', [courseId, userId || null, ip || null]);
}
async function getAllCourses(filters) {
    const page = Math.max(1, filters.page || 1);
    const limit = Math.min(100, filters.limit || 20);
    const offset = (page - 1) * limit;
    const conditions = ['1=1'];
    const params = [];
    let paramCount = 0;
    if (filters.status) {
        paramCount++;
        conditions.push(`status = $${paramCount}`);
        params.push(filters.status);
    }
    if (filters.category) {
        paramCount++;
        conditions.push(`category = $${paramCount}`);
        params.push(filters.category);
    }
    if (filters.level) {
        paramCount++;
        conditions.push(`level = $${paramCount}`);
        params.push(filters.level);
    }
    if (filters.search) {
        paramCount++;
        conditions.push(`title ILIKE $${paramCount}`);
        params.push(`%${filters.search}%`);
    }
    const where = conditions.join(' AND ');
    const countResult = await pool_1.default.query(`SELECT COUNT(*) FROM courses WHERE ${where}`, params);
    const total = parseInt(countResult.rows[0].count);
    params.push(limit, offset);
    const { rows } = await pool_1.default.query(`SELECT * FROM courses WHERE ${where}
     ORDER BY created_at DESC
     LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`, params);
    return {
        data: rows.map(helpers_1.formatCourse),
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
}
async function createCourse(dto, createdBy) {
    const slug = await generateUniqueSlug(dto.title);
    const { rows } = await pool_1.default.query(`INSERT INTO courses (
      title, slug, description, short_desc, category, price, discount_percent,
      duration, level, instructor, tags, status, certified, color, created_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    RETURNING *`, [
        dto.title, slug, dto.description || null, dto.shortDesc || null,
        dto.category, dto.price || 0, dto.discountPercent || 0,
        dto.duration || null, dto.level || 'Intermediate',
        dto.instructor || null,
        dto.tags || [],
        dto.status || 'draft',
        dto.certified || false, dto.color || '#6b7280', createdBy,
    ]);
    return (0, helpers_1.formatCourse)(rows[0]);
}
async function updateCourse(id, dto) {
    const fields = [];
    const params = [];
    let i = 1;
    const map = {
        title: dto.title,
        description: dto.description,
        short_desc: dto.shortDesc,
        category: dto.category,
        price: dto.price,
        discount_percent: dto.discountPercent,
        thumbnail_url: dto.thumbnailUrl,
        gallery_urls: dto.galleryUrls,
        duration: dto.duration,
        level: dto.level,
        instructor: dto.instructor,
        tags: dto.tags,
        status: dto.status,
        certified: dto.certified,
        color: dto.color,
    };
    for (const [key, value] of Object.entries(map)) {
        if (value !== undefined) {
            fields.push(`${key} = $${i}`);
            params.push(value);
            i++;
        }
    }
    if (fields.length === 0)
        throw { status: 400, message: 'No fields to update' };
    fields.push(`updated_at = NOW()`);
    params.push(id);
    const { rows } = await pool_1.default.query(`UPDATE courses SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, params);
    if (rows.length === 0)
        throw { status: 404, message: 'Course not found' };
    return (0, helpers_1.formatCourse)(rows[0]);
}
async function deleteCourse(id) {
    const { rows } = await pool_1.default.query(`UPDATE courses SET status = 'archived', updated_at = NOW() WHERE id = $1 RETURNING id`, [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Course not found' };
}
async function publishCourse(id) {
    const { rows } = await pool_1.default.query(`UPDATE courses SET status = 'published', updated_at = NOW() WHERE id = $1 RETURNING *`, [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Course not found' };
    return (0, helpers_1.formatCourse)(rows[0]);
}
async function unpublishCourse(id) {
    const { rows } = await pool_1.default.query(`UPDATE courses SET status = 'draft', updated_at = NOW() WHERE id = $1 RETURNING *`, [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Course not found' };
    return (0, helpers_1.formatCourse)(rows[0]);
}
async function getFeaturedCourses() {
    const { rows } = await pool_1.default.query(`SELECT * FROM courses WHERE featured = TRUE AND status = 'published'
     ORDER BY featured_order ASC, created_at ASC`);
    return rows.map(helpers_1.formatCourse);
}
async function setFeatured(id, featured, order) {
    const { rows } = await pool_1.default.query(`UPDATE courses
     SET featured = $1, featured_order = COALESCE($2, featured_order), updated_at = NOW()
     WHERE id = $3 RETURNING *`, [featured, order ?? null, id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Course not found' };
    return (0, helpers_1.formatCourse)(rows[0]);
}
async function reorderFeatured(orderedIds) {
    const client = await pool_1.default.connect();
    try {
        await client.query('BEGIN');
        for (let i = 0; i < orderedIds.length; i++) {
            await client.query(`UPDATE courses SET featured_order = $1, updated_at = NOW() WHERE id = $2`, [i + 1, orderedIds[i]]);
        }
        await client.query('COMMIT');
    }
    catch (err) {
        await client.query('ROLLBACK');
        throw err;
    }
    finally {
        client.release();
    }
}
async function generateUniqueSlug(title) {
    let slug = (0, helpers_1.slugify)(title);
    let suffix = 0;
    while (true) {
        const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
        const { rows } = await pool_1.default.query('SELECT id FROM courses WHERE slug = $1', [candidate]);
        if (rows.length === 0)
            return candidate;
        suffix++;
    }
}
//# sourceMappingURL=courses.service.js.map