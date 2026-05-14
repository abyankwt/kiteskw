"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPosts = listPosts;
exports.getPostBySlug = getPostBySlug;
exports.getPostById = getPostById;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.publishPost = publishPost;
exports.unpublishPost = unpublishPost;
exports.deletePost = deletePost;
const pool_1 = __importDefault(require("../db/pool"));
function slugify(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
async function uniqueSlug(base, excludeId) {
    let slug = slugify(base);
    let attempt = 0;
    while (true) {
        const candidate = attempt === 0 ? slug : `${slug}-${attempt}`;
        const { rows } = await pool_1.default.query(`SELECT id FROM blog_posts WHERE slug=$1 AND ($2::uuid IS NULL OR id != $2)`, [candidate, excludeId ?? null]);
        if (rows.length === 0)
            return candidate;
        attempt++;
    }
}
async function listPosts(publishedOnly = true, page = 1, limit = 12, category) {
    const conditions = [];
    const params = [];
    let i = 1;
    if (publishedOnly) {
        conditions.push(`p.is_published = TRUE`);
    }
    if (category) {
        conditions.push(`p.category = $${i++}`);
        params.push(category);
    }
    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const countResult = await pool_1.default.query(`SELECT COUNT(*) FROM blog_posts p ${where}`, params);
    const total = parseInt(countResult.rows[0].count);
    params.push(limit, (page - 1) * limit);
    const { rows } = await pool_1.default.query(`SELECT p.id, p.title, p.slug, p.excerpt, p.thumbnail_url, p.category,
            p.tags, p.is_published, p.published_at, p.created_at,
            u.full_name as author_name
     FROM blog_posts p
     LEFT JOIN users u ON u.id = p.author_id
     ${where}
     ORDER BY p.published_at DESC NULLS LAST, p.created_at DESC
     LIMIT $${i} OFFSET $${i + 1}`, params);
    return { data: rows.map(formatPost), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}
async function getPostBySlug(slug) {
    const { rows } = await pool_1.default.query(`SELECT p.*, u.full_name as author_name
     FROM blog_posts p
     LEFT JOIN users u ON u.id = p.author_id
     WHERE p.slug=$1`, [slug]);
    if (rows.length === 0)
        throw { status: 404, message: 'Post not found' };
    return formatPost(rows[0]);
}
async function getPostById(id) {
    const { rows } = await pool_1.default.query(`SELECT p.*, u.full_name as author_name FROM blog_posts p LEFT JOIN users u ON u.id=p.author_id WHERE p.id=$1`, [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Post not found' };
    return formatPost(rows[0]);
}
async function createPost(dto, authorId) {
    const slug = await uniqueSlug(dto.title);
    const { rows } = await pool_1.default.query(`INSERT INTO blog_posts (title, slug, content, excerpt, thumbnail_url, category, tags, author_id)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [dto.title, slug, dto.content ?? null, dto.excerpt ?? null, dto.thumbnailUrl ?? null,
        dto.category ?? 'news', dto.tags ?? [], authorId]);
    return formatPost(rows[0]);
}
async function updatePost(id, dto) {
    const fields = [];
    const values = [];
    let i = 1;
    if (dto.title !== undefined) {
        fields.push(`title=$${i++}`);
        values.push(dto.title);
    }
    if (dto.content !== undefined) {
        fields.push(`content=$${i++}`);
        values.push(dto.content);
    }
    if (dto.excerpt !== undefined) {
        fields.push(`excerpt=$${i++}`);
        values.push(dto.excerpt);
    }
    if (dto.thumbnailUrl !== undefined) {
        fields.push(`thumbnail_url=$${i++}`);
        values.push(dto.thumbnailUrl);
    }
    if (dto.category !== undefined) {
        fields.push(`category=$${i++}`);
        values.push(dto.category);
    }
    if (dto.tags !== undefined) {
        fields.push(`tags=$${i++}`);
        values.push(dto.tags);
    }
    if (fields.length === 0)
        throw { status: 400, message: 'No fields to update' };
    fields.push(`updated_at=NOW()`);
    values.push(id);
    const { rows } = await pool_1.default.query(`UPDATE blog_posts SET ${fields.join(', ')} WHERE id=$${i} RETURNING *`, values);
    if (rows.length === 0)
        throw { status: 404, message: 'Post not found' };
    return formatPost(rows[0]);
}
async function publishPost(id) {
    const { rows } = await pool_1.default.query(`UPDATE blog_posts SET is_published=TRUE, published_at=NOW(), updated_at=NOW() WHERE id=$1 RETURNING *`, [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Post not found' };
    return formatPost(rows[0]);
}
async function unpublishPost(id) {
    const { rows } = await pool_1.default.query(`UPDATE blog_posts SET is_published=FALSE, updated_at=NOW() WHERE id=$1 RETURNING *`, [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Post not found' };
    return formatPost(rows[0]);
}
async function deletePost(id) {
    const { rowCount } = await pool_1.default.query('DELETE FROM blog_posts WHERE id=$1', [id]);
    if (rowCount === 0)
        throw { status: 404, message: 'Post not found' };
}
function formatPost(row) {
    return {
        id: row.id,
        title: row.title,
        slug: row.slug,
        content: row.content,
        excerpt: row.excerpt,
        thumbnailUrl: row.thumbnail_url,
        category: row.category,
        tags: row.tags ?? [],
        isPublished: row.is_published,
        publishedAt: row.published_at,
        authorName: row.author_name ?? null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
//# sourceMappingURL=blog.service.js.map