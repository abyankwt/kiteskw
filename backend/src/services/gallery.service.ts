import pool from '../db/pool';

export interface GalleryDto {
  title: string;
  description?: string;
  eventDate?: string | null;
  coverImageUrl?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
}

export async function listGalleries(publishedOnly = true) {
  const where = publishedOnly ? 'WHERE g.is_published = TRUE' : '';
  const { rows } = await pool.query(
    `SELECT g.*,
            COUNT(gi.id)::int as photo_count
     FROM galleries g
     LEFT JOIN gallery_items gi ON gi.gallery_id = g.id
     ${where}
     GROUP BY g.id
     ORDER BY g.sort_order ASC, g.event_date DESC NULLS LAST, g.created_at DESC`
  );
  return rows.map(formatGallery);
}

export async function getGallery(id: string) {
  const { rows: galleryRows } = await pool.query(
    `SELECT g.*, COUNT(gi.id)::int as photo_count
     FROM galleries g LEFT JOIN gallery_items gi ON gi.gallery_id=g.id
     WHERE g.id=$1 GROUP BY g.id`,
    [id]
  );
  if (galleryRows.length === 0) throw { status: 404, message: 'Gallery not found' };

  const { rows: itemRows } = await pool.query(
    `SELECT gi.id, gi.gallery_id, gi.caption, gi.sort_order,
            m.id as media_id, m.filename, m.original_name, m.storage_path
     FROM gallery_items gi
     JOIN media m ON m.id = gi.media_id
     WHERE gi.gallery_id=$1
     ORDER BY gi.sort_order ASC, gi.created_at ASC`,
    [id]
  );

  return { ...formatGallery(galleryRows[0]), items: itemRows.map(formatItem) };
}

export async function createGallery(dto: GalleryDto, createdBy: string) {
  const { rows } = await pool.query(
    `INSERT INTO galleries (title, description, event_date, cover_image_url, is_published, sort_order, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [dto.title, dto.description ?? null, dto.eventDate ?? null,
     dto.coverImageUrl ?? null, dto.isPublished ?? false, dto.sortOrder ?? 0, createdBy]
  );
  return formatGallery(rows[0]);
}

export async function updateGallery(id: string, dto: Partial<GalleryDto>) {
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (dto.title !== undefined) { fields.push(`title=$${i++}`); values.push(dto.title); }
  if (dto.description !== undefined) { fields.push(`description=$${i++}`); values.push(dto.description); }
  if (dto.eventDate !== undefined) { fields.push(`event_date=$${i++}`); values.push(dto.eventDate); }
  if (dto.coverImageUrl !== undefined) { fields.push(`cover_image_url=$${i++}`); values.push(dto.coverImageUrl); }
  if (dto.isPublished !== undefined) { fields.push(`is_published=$${i++}`); values.push(dto.isPublished); }
  if (dto.sortOrder !== undefined) { fields.push(`sort_order=$${i++}`); values.push(dto.sortOrder); }
  if (fields.length === 0) throw { status: 400, message: 'No fields to update' };

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE galleries SET ${fields.join(', ')} WHERE id=$${i} RETURNING *`,
    values
  );
  if (rows.length === 0) throw { status: 404, message: 'Gallery not found' };
  return formatGallery(rows[0]);
}

export async function deleteGallery(id: string) {
  const { rowCount } = await pool.query('DELETE FROM galleries WHERE id=$1', [id]);
  if (rowCount === 0) throw { status: 404, message: 'Gallery not found' };
}

export async function addGalleryItem(galleryId: string, mediaId: string, caption?: string) {
  const { rows: orderRows } = await pool.query(
    `SELECT COALESCE(MAX(sort_order), 0) + 1 as next_order FROM gallery_items WHERE gallery_id=$1`,
    [galleryId]
  );
  const nextOrder = orderRows[0].next_order;
  const { rows } = await pool.query(
    `INSERT INTO gallery_items (gallery_id, media_id, caption, sort_order)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [galleryId, mediaId, caption ?? null, nextOrder]
  );
  return rows[0];
}

export async function removeGalleryItem(itemId: string) {
  const { rowCount } = await pool.query('DELETE FROM gallery_items WHERE id=$1', [itemId]);
  if (rowCount === 0) throw { status: 404, message: 'Item not found' };
}

export async function reorderGalleryItems(galleryId: string, orderedIds: string[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < orderedIds.length; i++) {
      await client.query(
        'UPDATE gallery_items SET sort_order=$1 WHERE id=$2 AND gallery_id=$3',
        [i + 1, orderedIds[i], galleryId]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

function formatGallery(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    eventDate: row.event_date,
    coverImageUrl: row.cover_image_url,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    photoCount: row.photo_count ?? 0,
    createdAt: row.created_at,
  };
}

function formatItem(row: any) {
  const baseUrl = process.env.API_BASE_URL || '';
  return {
    id: row.id,
    galleryId: row.gallery_id,
    mediaId: row.media_id,
    caption: row.caption,
    sortOrder: row.sort_order,
    url: `${baseUrl}/uploads/${row.filename}`,
    filename: row.filename,
    originalName: row.original_name,
  };
}
