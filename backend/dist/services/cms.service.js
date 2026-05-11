"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPages = getPages;
exports.getPageBySlug = getPageBySlug;
exports.publishPage = publishPage;
exports.unpublishPage = unpublishPage;
exports.updatePageMeta = updatePageMeta;
exports.toggleSection = toggleSection;
exports.getSectionBlocks = getSectionBlocks;
exports.getBlock = getBlock;
exports.updateBlock = updateBlock;
exports.getBlockHistory = getBlockHistory;
exports.revertBlock = revertBlock;
const pool_1 = __importDefault(require("../db/pool"));
// ─── Pages ───────────────────────────────────────────────────────────────────
async function getPages() {
    const { rows } = await pool_1.default.query(`SELECT id, slug, title, meta_title, meta_description, is_published, published_at, updated_at
     FROM cms_pages ORDER BY slug`);
    return rows;
}
async function getPageBySlug(slug) {
    const { rows: pages } = await pool_1.default.query('SELECT * FROM cms_pages WHERE slug = $1', [slug]);
    if (pages.length === 0)
        throw { status: 404, message: `CMS page '${slug}' not found` };
    const page = pages[0];
    const { rows: sections } = await pool_1.default.query(`SELECT * FROM cms_sections WHERE page_id = $1 ORDER BY sort_order`, [page.id]);
    const sectionIds = sections.map((s) => s.id);
    let blocks = [];
    if (sectionIds.length > 0) {
        const { rows } = await pool_1.default.query(`SELECT b.*, m.storage_path AS media_url, m.alt_text AS media_alt
       FROM cms_blocks b
       LEFT JOIN media m ON m.id = b.value_media_id
       WHERE b.section_id = ANY($1)
       ORDER BY b.sort_order`, [sectionIds]);
        blocks = rows;
    }
    // Assemble nested structure
    const assembled = {};
    for (const section of sections) {
        const sectionBlocks = blocks.filter((b) => b.section_id === section.id);
        const byKey = {};
        for (const block of sectionBlocks) {
            const value = block.value_json ?? block.value_text ?? null;
            if (!byKey[block.field_key])
                byKey[block.field_key] = {};
            byKey[block.field_key][block.locale] = value;
            // Include block UUID so the admin editor can PATCH individual blocks
            if (!byKey[block.field_key]._ids)
                byKey[block.field_key]._ids = {};
            byKey[block.field_key]._ids[block.locale] = block.id;
            byKey[block.field_key]._type = block.block_type;
            if (block.media_url) {
                byKey[block.field_key].media_url = block.media_url;
                byKey[block.field_key].media_alt = block.media_alt;
            }
        }
        assembled[section.section_key] = {
            id: section.id,
            display_name: section.display_name,
            is_visible: section.is_visible,
            sort_order: section.sort_order,
            blocks: byKey,
        };
    }
    return {
        id: page.id,
        slug: page.slug,
        title: page.title,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        is_published: page.is_published,
        updated_at: page.updated_at,
        sections: assembled,
    };
}
async function publishPage(slug, userId) {
    const { rows } = await pool_1.default.query(`UPDATE cms_pages
     SET is_published = true, published_at = NOW(), updated_by = $1, updated_at = NOW()
     WHERE slug = $2 RETURNING *`, [userId, slug]);
    if (rows.length === 0)
        throw { status: 404, message: 'Page not found' };
    return rows[0];
}
async function unpublishPage(slug, userId) {
    const { rows } = await pool_1.default.query(`UPDATE cms_pages
     SET is_published = false, updated_by = $1, updated_at = NOW()
     WHERE slug = $2 RETURNING *`, [userId, slug]);
    if (rows.length === 0)
        throw { status: 404, message: 'Page not found' };
    return rows[0];
}
async function updatePageMeta(slug, userId, data) {
    const fields = ['updated_by = $1', 'updated_at = NOW()'];
    const params = [userId];
    let i = 2;
    if (data.title !== undefined) {
        fields.push(`title = $${i++}`);
        params.push(data.title);
    }
    if (data.meta_title !== undefined) {
        fields.push(`meta_title = $${i++}`);
        params.push(data.meta_title);
    }
    if (data.meta_description !== undefined) {
        fields.push(`meta_description = $${i++}`);
        params.push(data.meta_description);
    }
    params.push(slug);
    const { rows } = await pool_1.default.query(`UPDATE cms_pages SET ${fields.join(', ')} WHERE slug = $${i} RETURNING *`, params);
    if (rows.length === 0)
        throw { status: 404, message: 'Page not found' };
    return rows[0];
}
// ─── Sections ────────────────────────────────────────────────────────────────
async function toggleSection(sectionId, isVisible) {
    const { rows } = await pool_1.default.query(`UPDATE cms_sections SET is_visible = $1, updated_at = NOW() WHERE id = $2 RETURNING *`, [isVisible, sectionId]);
    if (rows.length === 0)
        throw { status: 404, message: 'Section not found' };
    return rows[0];
}
async function getSectionBlocks(sectionId) {
    const { rows } = await pool_1.default.query(`SELECT b.*, m.storage_path AS media_url
     FROM cms_blocks b
     LEFT JOIN media m ON m.id = b.value_media_id
     WHERE b.section_id = $1
     ORDER BY b.sort_order`, [sectionId]);
    return rows;
}
// ─── Blocks ──────────────────────────────────────────────────────────────────
async function getBlock(blockId) {
    const { rows } = await pool_1.default.query('SELECT * FROM cms_blocks WHERE id = $1', [blockId]);
    if (rows.length === 0)
        throw { status: 404, message: 'Block not found' };
    return rows[0];
}
async function updateBlock(blockId, userId, data) {
    const block = await getBlock(blockId);
    // Record revision before overwriting
    const previousValue = block.value_text ?? JSON.stringify(block.value_json) ?? null;
    const newValue = data.value_text ?? (data.value_json ? JSON.stringify(data.value_json) : null);
    await pool_1.default.query(`INSERT INTO cms_revisions (block_id, previous_value, new_value, changed_by)
     VALUES ($1, $2, $3, $4)`, [blockId, previousValue, newValue, userId]);
    const fields = ['updated_at = NOW()'];
    const params = [];
    let i = 1;
    if (data.value_text !== undefined) {
        fields.push(`value_text = $${i++}`);
        params.push(data.value_text);
    }
    if (data.value_json !== undefined) {
        fields.push(`value_json = $${i++}`);
        params.push(JSON.stringify(data.value_json));
    }
    if (data.value_media_id !== undefined) {
        fields.push(`value_media_id = $${i++}`);
        params.push(data.value_media_id);
    }
    if (i === 1)
        throw { status: 400, message: 'No fields to update' };
    params.push(blockId);
    const { rows } = await pool_1.default.query(`UPDATE cms_blocks SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`, params);
    return rows[0];
}
async function getBlockHistory(blockId) {
    const { rows } = await pool_1.default.query(`SELECT r.*, u.full_name AS changed_by_name
     FROM cms_revisions r
     LEFT JOIN users u ON u.id = r.changed_by
     WHERE r.block_id = $1
     ORDER BY r.changed_at DESC
     LIMIT 50`, [blockId]);
    return rows;
}
async function revertBlock(blockId, revisionId, userId) {
    const { rows: revs } = await pool_1.default.query('SELECT * FROM cms_revisions WHERE id = $1 AND block_id = $2', [revisionId, blockId]);
    if (revs.length === 0)
        throw { status: 404, message: 'Revision not found' };
    const revision = revs[0];
    // previous_value of the chosen revision becomes the restored value
    const restoredText = revision.previous_value;
    return updateBlock(blockId, userId, { value_text: restoredText ?? undefined });
}
//# sourceMappingURL=cms.service.js.map