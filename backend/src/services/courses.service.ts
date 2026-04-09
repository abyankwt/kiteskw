import pool from '../db/pool';
import { slugify, formatCourse } from '../utils/helpers';
import { CreateCourseDTO, UpdateCourseDTO } from '../types/course.types';

export async function getPublishedCourses(filters: {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  search?: string;
}) {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, filters.limit || 20);
  const offset = (page - 1) * limit;

  const conditions: string[] = ["status = 'published'"];
  const params: any[] = [];
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

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM courses WHERE ${where}`,
    params
  );
  const total = parseInt(countResult.rows[0].count);

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT * FROM courses WHERE ${where}
     ORDER BY enrollment_count DESC, created_at DESC
     LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
    params
  );

  return {
    data: rows.map(formatCourse),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getCourseBySlug(slug: string) {
  const { rows } = await pool.query('SELECT * FROM courses WHERE slug = $1', [slug]);
  if (rows.length === 0) throw { status: 404, message: 'Course not found' };
  return formatCourse(rows[0]);
}

export async function getCourseById(id: string) {
  const { rows } = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
  if (rows.length === 0) throw { status: 404, message: 'Course not found' };
  return formatCourse(rows[0]);
}

export async function recordView(courseId: string, userId?: string, ip?: string) {
  await pool.query(
    'INSERT INTO course_views (course_id, user_id, ip_address) VALUES ($1, $2, $3)',
    [courseId, userId || null, ip || null]
  );
}

export async function getAllCourses(filters: {
  page?: number;
  limit?: number;
  category?: string;
  level?: string;
  status?: string;
  search?: string;
}) {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, filters.limit || 20);
  const offset = (page - 1) * limit;

  const conditions: string[] = ['1=1'];
  const params: any[] = [];
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
  const countResult = await pool.query(`SELECT COUNT(*) FROM courses WHERE ${where}`, params);
  const total = parseInt(countResult.rows[0].count);

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT * FROM courses WHERE ${where}
     ORDER BY created_at DESC
     LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}`,
    params
  );

  return {
    data: rows.map(formatCourse),
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function createCourse(dto: CreateCourseDTO, createdBy: string) {
  const slug = await generateUniqueSlug(dto.title);

  const { rows } = await pool.query(
    `INSERT INTO courses (
      title, slug, description, short_desc, category, price, discount_percent,
      duration, level, instructor, tags, status, certified, color, created_by
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    RETURNING *`,
    [
      dto.title, slug, dto.description || null, dto.shortDesc || null,
      dto.category, dto.price || 0, dto.discountPercent || 0,
      dto.duration || null, dto.level || 'Intermediate',
      dto.instructor || null,
      dto.tags || [],
      dto.status || 'draft',
      dto.certified || false, dto.color || '#6b7280', createdBy,
    ]
  );

  return formatCourse(rows[0]);
}

export async function updateCourse(id: string, dto: UpdateCourseDTO) {
  const fields: string[] = [];
  const params: any[] = [];
  let i = 1;

  const map: Record<string, any> = {
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

  if (fields.length === 0) throw { status: 400, message: 'No fields to update' };

  fields.push(`updated_at = NOW()`);
  params.push(id);

  const { rows } = await pool.query(
    `UPDATE courses SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
    params
  );

  if (rows.length === 0) throw { status: 404, message: 'Course not found' };
  return formatCourse(rows[0]);
}

export async function deleteCourse(id: string) {
  const { rows } = await pool.query(
    `UPDATE courses SET status = 'archived', updated_at = NOW() WHERE id = $1 RETURNING id`,
    [id]
  );
  if (rows.length === 0) throw { status: 404, message: 'Course not found' };
}

export async function publishCourse(id: string) {
  const { rows } = await pool.query(
    `UPDATE courses SET status = 'published', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
  if (rows.length === 0) throw { status: 404, message: 'Course not found' };
  return formatCourse(rows[0]);
}

export async function unpublishCourse(id: string) {
  const { rows } = await pool.query(
    `UPDATE courses SET status = 'draft', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
  if (rows.length === 0) throw { status: 404, message: 'Course not found' };
  return formatCourse(rows[0]);
}

async function generateUniqueSlug(title: string): Promise<string> {
  let slug = slugify(title);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const { rows } = await pool.query('SELECT id FROM courses WHERE slug = $1', [candidate]);
    if (rows.length === 0) return candidate;
    suffix++;
  }
}
