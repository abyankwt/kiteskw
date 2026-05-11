import pool from '../db/pool';
import fs from 'fs';
import path from 'path';

export interface SaveMediaDTO {
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  uploadedBy: string;
}

export async function saveMedia(dto: SaveMediaDTO) {
  const { rows } = await pool.query(
    `INSERT INTO media (filename, original_name, mime_type, size_bytes, storage_path, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [dto.filename, dto.originalName, dto.mimeType, dto.sizeBytes, dto.storagePath, dto.uploadedBy]
  );
  return rows[0];
}

export async function listMedia(page = 1, limit = 50) {
  const offset = (page - 1) * limit;
  const [{ rows }, countResult] = await Promise.all([
    pool.query(
      `SELECT m.*, u.full_name AS uploader_name
       FROM media m
       LEFT JOIN users u ON u.id = m.uploaded_by
       ORDER BY m.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    ),
    pool.query('SELECT COUNT(*) FROM media'),
  ]);
  return {
    data: rows,
    pagination: { page, limit, total: parseInt(countResult.rows[0].count) },
  };
}

export async function getMediaById(id: string) {
  const { rows } = await pool.query('SELECT * FROM media WHERE id = $1', [id]);
  if (rows.length === 0) throw { status: 404, message: 'Media not found' };
  return rows[0];
}

export async function updateAltText(id: string, altText: string) {
  const { rows } = await pool.query(
    'UPDATE media SET alt_text = $1 WHERE id = $2 RETURNING *',
    [altText, id]
  );
  if (rows.length === 0) throw { status: 404, message: 'Media not found' };
  return rows[0];
}

export async function deleteMedia(id: string) {
  const { rows } = await pool.query(
    'DELETE FROM media WHERE id = $1 RETURNING *',
    [id]
  );
  if (rows.length === 0) throw { status: 404, message: 'Media not found' };

  // Remove physical file
  const record = rows[0];
  const fullPath = path.join(process.cwd(), record.storage_path);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
  return record;
}
