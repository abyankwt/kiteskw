import pool from '../db/pool';

export interface TestimonialDto {
  clientName: string;
  clientRole?: string;
  clientCompany?: string;
  content: string;
  rating?: number;
  avatarUrl?: string;
  courseId?: string | null;
  isPublished?: boolean;
  sortOrder?: number;
  displayLocation?: 'all' | 'homepage' | 'training';
}

export async function listTestimonials(publishedOnly = true, location?: string) {
  const conditions: string[] = [];
  if (publishedOnly) conditions.push('is_published = TRUE');
  if (location && location !== 'all') {
    conditions.push(`(display_location = 'all' OR display_location = '${location === 'homepage' ? 'homepage' : 'training'}')`);
  }
  const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
  const { rows } = await pool.query(
    `SELECT t.*, c.title as course_title
     FROM testimonials t
     LEFT JOIN courses c ON c.id = t.course_id
     ${where}
     ORDER BY t.sort_order ASC, t.created_at DESC`
  );
  return rows.map(formatTestimonial);
}

export async function createTestimonial(dto: TestimonialDto) {
  const { rows } = await pool.query(
    `INSERT INTO testimonials
       (client_name, client_role, client_company, content, rating, avatar_url, course_id, is_published, sort_order, display_location)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [dto.clientName, dto.clientRole ?? null, dto.clientCompany ?? null, dto.content,
     dto.rating ?? 5, dto.avatarUrl ?? null, dto.courseId ?? null,
     dto.isPublished ?? true, dto.sortOrder ?? 0, dto.displayLocation ?? 'all']
  );
  return formatTestimonial(rows[0]);
}

export async function updateTestimonial(id: string, dto: Partial<TestimonialDto>) {
  const fields: string[] = [];
  const values: any[] = [];
  let i = 1;

  if (dto.clientName !== undefined) { fields.push(`client_name=$${i++}`); values.push(dto.clientName); }
  if (dto.clientRole !== undefined) { fields.push(`client_role=$${i++}`); values.push(dto.clientRole); }
  if (dto.clientCompany !== undefined) { fields.push(`client_company=$${i++}`); values.push(dto.clientCompany); }
  if (dto.content !== undefined) { fields.push(`content=$${i++}`); values.push(dto.content); }
  if (dto.rating !== undefined) { fields.push(`rating=$${i++}`); values.push(dto.rating); }
  if (dto.avatarUrl !== undefined) { fields.push(`avatar_url=$${i++}`); values.push(dto.avatarUrl); }
  if (dto.courseId !== undefined) { fields.push(`course_id=$${i++}`); values.push(dto.courseId); }
  if (dto.isPublished !== undefined) { fields.push(`is_published=$${i++}`); values.push(dto.isPublished); }
  if (dto.sortOrder !== undefined) { fields.push(`sort_order=$${i++}`); values.push(dto.sortOrder); }
  if (dto.displayLocation !== undefined) { fields.push(`display_location=$${i++}`); values.push(dto.displayLocation); }
  if (fields.length === 0) throw { status: 400, message: 'No fields to update' };

  values.push(id);
  const { rows } = await pool.query(
    `UPDATE testimonials SET ${fields.join(', ')} WHERE id=$${i} RETURNING *`,
    values
  );
  if (rows.length === 0) throw { status: 404, message: 'Testimonial not found' };
  return formatTestimonial(rows[0]);
}

export async function deleteTestimonial(id: string) {
  const { rowCount } = await pool.query('DELETE FROM testimonials WHERE id=$1', [id]);
  if (rowCount === 0) throw { status: 404, message: 'Testimonial not found' };
}

export async function reorderTestimonials(orderedIds: string[]) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (let i = 0; i < orderedIds.length; i++) {
      await client.query('UPDATE testimonials SET sort_order=$1 WHERE id=$2', [i + 1, orderedIds[i]]);
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

function formatTestimonial(row: any) {
  return {
    id: row.id,
    clientName: row.client_name,
    clientRole: row.client_role,
    clientCompany: row.client_company,
    content: row.content,
    rating: row.rating,
    avatarUrl: row.avatar_url,
    courseId: row.course_id,
    courseTitle: row.course_title ?? null,
    isPublished: row.is_published,
    sortOrder: row.sort_order,
    displayLocation: row.display_location ?? 'all',
    createdAt: row.created_at,
  };
}
