import pool from '../db/pool';

// ─── Pages ───────────────────────────────────────────────────────────────────

export async function getPages() {
  const { rows } = await pool.query(
    `SELECT id, slug, title, meta_title, meta_description, is_published, published_at, updated_at
     FROM cms_pages ORDER BY slug`
  );
  return rows;
}

export async function getPageBySlug(slug: string) {
  const { rows: pages } = await pool.query(
    'SELECT * FROM cms_pages WHERE slug = $1',
    [slug]
  );
  if (pages.length === 0) throw { status: 404, message: `CMS page '${slug}' not found` };
  const page = pages[0];

  const { rows: sections } = await pool.query(
    `SELECT * FROM cms_sections WHERE page_id = $1 ORDER BY sort_order`,
    [page.id]
  );

  const sectionIds = sections.map((s: any) => s.id);
  let blocks: any[] = [];
  if (sectionIds.length > 0) {
    const { rows } = await pool.query(
      `SELECT b.*, m.storage_path AS media_url, m.alt_text AS media_alt
       FROM cms_blocks b
       LEFT JOIN media m ON m.id = b.value_media_id
       WHERE b.section_id = ANY($1)
       ORDER BY b.sort_order`,
      [sectionIds]
    );
    blocks = rows;
  }

  // Assemble nested structure
  const assembled: Record<string, any> = {};
  for (const section of sections) {
    const sectionBlocks = blocks.filter((b: any) => b.section_id === section.id);
    const byKey: Record<string, any> = {};
    for (const block of sectionBlocks) {
      const value = block.value_json ?? block.value_text ?? null;
      if (!byKey[block.field_key]) byKey[block.field_key] = {};
      byKey[block.field_key][block.locale] = value;
      // Include block UUID so the admin editor can PATCH individual blocks
      if (!byKey[block.field_key]._ids) byKey[block.field_key]._ids = {};
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

export async function publishPage(slug: string, userId: string) {
  const { rows } = await pool.query(
    `UPDATE cms_pages
     SET is_published = true, published_at = NOW(), updated_by = $1, updated_at = NOW()
     WHERE slug = $2 RETURNING *`,
    [userId, slug]
  );
  if (rows.length === 0) throw { status: 404, message: 'Page not found' };
  return rows[0];
}

export async function unpublishPage(slug: string, userId: string) {
  const { rows } = await pool.query(
    `UPDATE cms_pages
     SET is_published = false, updated_by = $1, updated_at = NOW()
     WHERE slug = $2 RETURNING *`,
    [userId, slug]
  );
  if (rows.length === 0) throw { status: 404, message: 'Page not found' };
  return rows[0];
}

export async function updatePageMeta(
  slug: string,
  userId: string,
  data: { title?: string; meta_title?: string; meta_description?: string }
) {
  const fields: string[] = ['updated_by = $1', 'updated_at = NOW()'];
  const params: any[] = [userId];
  let i = 2;
  if (data.title !== undefined) { fields.push(`title = $${i++}`); params.push(data.title); }
  if (data.meta_title !== undefined) { fields.push(`meta_title = $${i++}`); params.push(data.meta_title); }
  if (data.meta_description !== undefined) { fields.push(`meta_description = $${i++}`); params.push(data.meta_description); }
  params.push(slug);
  const { rows } = await pool.query(
    `UPDATE cms_pages SET ${fields.join(', ')} WHERE slug = $${i} RETURNING *`,
    params
  );
  if (rows.length === 0) throw { status: 404, message: 'Page not found' };
  return rows[0];
}

// ─── Sections ────────────────────────────────────────────────────────────────

export async function toggleSection(sectionId: string, isVisible: boolean) {
  const { rows } = await pool.query(
    `UPDATE cms_sections SET is_visible = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [isVisible, sectionId]
  );
  if (rows.length === 0) throw { status: 404, message: 'Section not found' };
  return rows[0];
}

export async function getSectionBlocks(sectionId: string) {
  const { rows } = await pool.query(
    `SELECT b.*, m.storage_path AS media_url
     FROM cms_blocks b
     LEFT JOIN media m ON m.id = b.value_media_id
     WHERE b.section_id = $1
     ORDER BY b.sort_order`,
    [sectionId]
  );
  return rows;
}

// ─── Blocks ──────────────────────────────────────────────────────────────────

export async function getBlock(blockId: string) {
  const { rows } = await pool.query(
    'SELECT * FROM cms_blocks WHERE id = $1',
    [blockId]
  );
  if (rows.length === 0) throw { status: 404, message: 'Block not found' };
  return rows[0];
}

export async function updateBlock(
  blockId: string,
  userId: string,
  data: { value_text?: string; value_json?: any; value_media_id?: string | null }
) {
  const block = await getBlock(blockId);

  // Record revision before overwriting
  const previousValue = block.value_text ?? JSON.stringify(block.value_json) ?? null;
  const newValue = data.value_text ?? (data.value_json ? JSON.stringify(data.value_json) : null);

  await pool.query(
    `INSERT INTO cms_revisions (block_id, previous_value, new_value, changed_by)
     VALUES ($1, $2, $3, $4)`,
    [blockId, previousValue, newValue, userId]
  );

  const fields: string[] = ['updated_at = NOW()'];
  const params: any[] = [];
  let i = 1;

  if (data.value_text !== undefined) { fields.push(`value_text = $${i++}`); params.push(data.value_text); }
  if (data.value_json !== undefined) { fields.push(`value_json = $${i++}`); params.push(JSON.stringify(data.value_json)); }
  if (data.value_media_id !== undefined) { fields.push(`value_media_id = $${i++}`); params.push(data.value_media_id); }

  if (i === 1) throw { status: 400, message: 'No fields to update' };

  params.push(blockId);
  const { rows } = await pool.query(
    `UPDATE cms_blocks SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
    params
  );
  return rows[0];
}

export async function getBlockHistory(blockId: string) {
  const { rows } = await pool.query(
    `SELECT r.*, u.full_name AS changed_by_name
     FROM cms_revisions r
     LEFT JOIN users u ON u.id = r.changed_by
     WHERE r.block_id = $1
     ORDER BY r.changed_at DESC
     LIMIT 50`,
    [blockId]
  );
  return rows;
}

export async function revertBlock(blockId: string, revisionId: string, userId: string) {
  const { rows: revs } = await pool.query(
    'SELECT * FROM cms_revisions WHERE id = $1 AND block_id = $2',
    [revisionId, blockId]
  );
  if (revs.length === 0) throw { status: 404, message: 'Revision not found' };

  const revision = revs[0];
  // previous_value of the chosen revision becomes the restored value
  const restoredText = revision.previous_value;

  return updateBlock(blockId, userId, { value_text: restoredText ?? undefined });
}
