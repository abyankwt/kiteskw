import pool from '../db/pool';

export async function getOverview() {
  const [enrollments, revenue, courses, users, todayEnrollments, monthlyEnrollments, monthlyRevenue, views] =
    await Promise.all([
      pool.query(`SELECT COUNT(*) FROM enrollments WHERE status = 'active'`),
      pool.query(`SELECT COALESCE(SUM(amount_paid), 0) as total FROM enrollments WHERE status = 'active'`),
      pool.query(`SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'published') as published FROM courses`),
      pool.query(`SELECT COUNT(*) FROM users WHERE is_active = true`),
      pool.query(`SELECT COUNT(*) FROM enrollments WHERE status = 'active' AND enrolled_at >= CURRENT_DATE`),
      pool.query(`SELECT COUNT(*) FROM enrollments WHERE status = 'active' AND enrolled_at >= DATE_TRUNC('month', CURRENT_DATE)`),
      pool.query(`SELECT COALESCE(SUM(amount_paid), 0) as total FROM enrollments WHERE status = 'active' AND enrolled_at >= DATE_TRUNC('month', CURRENT_DATE)`),
      pool.query(`SELECT COUNT(*) FROM course_views WHERE viewed_at >= CURRENT_DATE`),
    ]);

  const totalEnrollments = parseInt(enrollments.rows[0].count);
  const todayEnroll = parseInt(todayEnrollments.rows[0].count);
  const monthEnroll = parseInt(monthlyEnrollments.rows[0].count);
  const totalViews = parseInt(views.rows[0].count);
  const conversionRate = totalViews > 0 ? ((totalEnrollments / totalViews) * 100).toFixed(1) : '0';

  return {
    totalEnrollments,
    enrollmentsToday: todayEnroll,
    enrollmentsThisMonth: monthEnroll,
    totalRevenue: parseFloat(revenue.rows[0].total),
    revenueThisMonth: parseFloat(monthlyRevenue.rows[0].total),
    totalCourses: parseInt(courses.rows[0].total),
    publishedCourses: parseInt(courses.rows[0].published),
    totalUsers: parseInt(users.rows[0].count),
    conversionRate: parseFloat(conversionRate),
    viewsToday: totalViews,
  };
}

export async function getEnrollmentsOverTime(from: string, to: string, groupBy: 'day' | 'week' | 'month' = 'day') {
  const trunc = groupBy === 'month' ? 'month' : groupBy === 'week' ? 'week' : 'day';

  const { rows } = await pool.query(
    `SELECT
       DATE_TRUNC($1, enrolled_at) as date,
       COUNT(*) as count,
       COALESCE(SUM(amount_paid), 0) as revenue
     FROM enrollments
     WHERE status = 'active'
       AND enrolled_at >= $2::date
       AND enrolled_at <= $3::date + INTERVAL '1 day'
     GROUP BY DATE_TRUNC($1, enrolled_at)
     ORDER BY date ASC`,
    [trunc, from, to]
  );

  return rows.map(r => ({
    date: r.date,
    count: parseInt(r.count),
    revenue: parseFloat(r.revenue),
  }));
}

export async function getTopCourses(limit = 10) {
  const { rows } = await pool.query(
    `SELECT
       c.id, c.title, c.category, c.enrollment_count, c.rating,
       COUNT(e.id) as recent_enrollments,
       COUNT(cv.id) as view_count
     FROM courses c
     LEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'active'
     LEFT JOIN course_views cv ON cv.course_id = c.id
     WHERE c.status = 'published'
     GROUP BY c.id
     ORDER BY c.enrollment_count DESC
     LIMIT $1`,
    [limit]
  );

  return rows.map(r => ({
    id: r.id,
    title: r.title,
    category: r.category,
    enrollmentCount: parseInt(r.enrollment_count),
    recentEnrollments: parseInt(r.recent_enrollments),
    viewCount: parseInt(r.view_count),
    rating: parseFloat(r.rating),
  }));
}

export async function getRevenueByCategory() {
  const { rows } = await pool.query(
    `SELECT
       c.category,
       COALESCE(SUM(e.amount_paid), 0) as revenue,
       COUNT(e.id) as enrollment_count
     FROM courses c
     LEFT JOIN enrollments e ON e.course_id = c.id AND e.status = 'active'
     GROUP BY c.category
     ORDER BY revenue DESC`
  );

  return rows.map(r => ({
    category: r.category,
    revenue: parseFloat(r.revenue),
    enrollmentCount: parseInt(r.enrollment_count),
  }));
}
