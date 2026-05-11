"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveMedia = saveMedia;
exports.listMedia = listMedia;
exports.getMediaById = getMediaById;
exports.updateAltText = updateAltText;
exports.deleteMedia = deleteMedia;
const pool_1 = __importDefault(require("../db/pool"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function saveMedia(dto) {
    const { rows } = await pool_1.default.query(`INSERT INTO media (filename, original_name, mime_type, size_bytes, storage_path, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`, [dto.filename, dto.originalName, dto.mimeType, dto.sizeBytes, dto.storagePath, dto.uploadedBy]);
    return rows[0];
}
async function listMedia(page = 1, limit = 50) {
    const offset = (page - 1) * limit;
    const [{ rows }, countResult] = await Promise.all([
        pool_1.default.query(`SELECT m.*, u.full_name AS uploader_name
       FROM media m
       LEFT JOIN users u ON u.id = m.uploaded_by
       ORDER BY m.created_at DESC
       LIMIT $1 OFFSET $2`, [limit, offset]),
        pool_1.default.query('SELECT COUNT(*) FROM media'),
    ]);
    return {
        data: rows,
        pagination: { page, limit, total: parseInt(countResult.rows[0].count) },
    };
}
async function getMediaById(id) {
    const { rows } = await pool_1.default.query('SELECT * FROM media WHERE id = $1', [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Media not found' };
    return rows[0];
}
async function updateAltText(id, altText) {
    const { rows } = await pool_1.default.query('UPDATE media SET alt_text = $1 WHERE id = $2 RETURNING *', [altText, id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Media not found' };
    return rows[0];
}
async function deleteMedia(id) {
    const { rows } = await pool_1.default.query('DELETE FROM media WHERE id = $1 RETURNING *', [id]);
    if (rows.length === 0)
        throw { status: 404, message: 'Media not found' };
    // Remove physical file
    const record = rows[0];
    const fullPath = path_1.default.join(process.cwd(), record.storage_path);
    if (fs_1.default.existsSync(fullPath)) {
        fs_1.default.unlinkSync(fullPath);
    }
    return record;
}
//# sourceMappingURL=media.service.js.map