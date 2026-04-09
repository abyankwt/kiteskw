import pool from '../db/pool';
import * as hesabeService from './hesabe.service';

export async function initiateCheckout(userId: string, courseId: string) {
  // Check course exists and is published
  const courseResult = await pool.query(
    `SELECT * FROM courses WHERE id = $1 AND status = 'published'`,
    [courseId]
  );
  if (courseResult.rows.length === 0) {
    throw { status: 404, message: 'Course not found or not available' };
  }
  const course = courseResult.rows[0];

  // Check if already enrolled
  const existingEnrollment = await pool.query(
    `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2 AND status = 'active'`,
    [userId, courseId]
  );
  if (existingEnrollment.rows.length > 0) {
    throw { status: 409, message: 'Already enrolled in this course' };
  }

  const effectivePrice = parseFloat(course.price) * (1 - course.discount_percent / 100);

  // Create pending enrollment
  const enrollmentResult = await pool.query(
    `INSERT INTO enrollments (user_id, course_id, status)
     VALUES ($1, $2, 'pending')
     ON CONFLICT (user_id, course_id) DO UPDATE SET status = 'pending'
     RETURNING *`,
    [userId, courseId]
  );
  const enrollment = enrollmentResult.rows[0];

  // Create pending payment
  const paymentResult = await pool.query(
    `INSERT INTO payments (enrollment_id, user_id, course_id, amount, currency, status)
     VALUES ($1, $2, $3, $4, 'KWD', 'pending')
     RETURNING *`,
    [enrollment.id, userId, courseId, effectivePrice]
  );
  const payment = paymentResult.rows[0];

  // If course is free, activate immediately
  if (effectivePrice === 0) {
    await pool.query(
      `UPDATE enrollments SET status = 'active', amount_paid = 0 WHERE id = $1`,
      [enrollment.id]
    );
    await pool.query(
      `UPDATE payments SET status = 'success' WHERE id = $1`,
      [payment.id]
    );
    await pool.query(
      `UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = $1`,
      [courseId]
    );
    return { free: true, courseTitle: course.title };
  }

  // Generate Hesabe payment URL
  const { paymentUrl } = hesabeService.createPaymentPayload({
    amount: effectivePrice,
    orderId: payment.id,
    userId,
    courseId,
  });

  // Update payment with hesabe order id
  await pool.query(
    `UPDATE payments SET hesabe_order_id = $1 WHERE id = $2`,
    [payment.id, payment.id]
  );

  return { free: false, paymentUrl, orderId: payment.id };
}

export async function handleWebhook(encryptedData: string) {
  const response = hesabeService.decryptCallback(encryptedData);

  const { rows: paymentRows } = await pool.query(
    `SELECT * FROM payments WHERE id = $1`,
    [response.orderReferenceNumber]
  );

  if (paymentRows.length === 0) {
    throw new Error(`Payment not found: ${response.orderReferenceNumber}`);
  }

  const payment = paymentRows[0];

  if (hesabeService.isPaymentSuccessful(response)) {
    // Activate enrollment
    await pool.query(
      `UPDATE enrollments SET status = 'active', amount_paid = $1, enrolled_at = NOW()
       WHERE id = $2`,
      [payment.amount, payment.enrollment_id]
    );

    // Update payment
    await pool.query(
      `UPDATE payments SET
         status = 'success',
         hesabe_payment_id = $1,
         hesabe_result_code = $2,
         gateway_response = $3,
         updated_at = NOW()
       WHERE id = $4`,
      [response.paymentId, response.resultCode, JSON.stringify(response), payment.id]
    );

    // Increment course enrollment count
    await pool.query(
      `UPDATE courses SET enrollment_count = enrollment_count + 1 WHERE id = $1`,
      [payment.course_id]
    );
  } else {
    // Mark payment failed
    await pool.query(
      `UPDATE payments SET
         status = 'failed',
         hesabe_result_code = $1,
         gateway_response = $2,
         updated_at = NOW()
       WHERE id = $3`,
      [response.resultCode, JSON.stringify(response), payment.id]
    );

    await pool.query(
      `UPDATE enrollments SET status = 'cancelled' WHERE id = $1`,
      [payment.enrollment_id]
    );
  }

  return response;
}

export async function getUserEnrollments(userId: string) {
  const { rows } = await pool.query(
    `SELECT e.*, c.title, c.slug, c.thumbnail_url, c.category, c.level, c.duration
     FROM enrollments e
     JOIN courses c ON c.id = e.course_id
     WHERE e.user_id = $1 AND e.status = 'active'
     ORDER BY e.enrolled_at DESC`,
    [userId]
  );
  return rows;
}

export async function getAllEnrollments(filters: { page?: number; limit?: number; courseId?: string; status?: string }) {
  const page = Math.max(1, filters.page || 1);
  const limit = Math.min(100, filters.limit || 20);
  const offset = (page - 1) * limit;

  const conditions: string[] = ['1=1'];
  const params: any[] = [];
  let i = 0;

  if (filters.courseId) {
    i++; conditions.push(`e.course_id = $${i}`); params.push(filters.courseId);
  }
  if (filters.status) {
    i++; conditions.push(`e.status = $${i}`); params.push(filters.status);
  }

  const where = conditions.join(' AND ');
  const countResult = await pool.query(
    `SELECT COUNT(*) FROM enrollments e WHERE ${where}`, params
  );
  const total = parseInt(countResult.rows[0].count);

  params.push(limit, offset);
  const { rows } = await pool.query(
    `SELECT e.*, u.email, u.full_name, c.title as course_title
     FROM enrollments e
     JOIN users u ON u.id = e.user_id
     JOIN courses c ON c.id = e.course_id
     WHERE ${where}
     ORDER BY e.enrolled_at DESC
     LIMIT $${i+1} OFFSET $${i+2}`,
    params
  );

  return {
    data: rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
