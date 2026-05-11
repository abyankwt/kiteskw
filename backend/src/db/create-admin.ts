/**
 * One-time script to create the first Super Admin user.
 * Run AFTER migrations:
 *   npx ts-node src/db/create-admin.ts
 */
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import pool from './pool';

const EMAIL    = process.env.ADMIN_EMAIL    || 'admin@kites-kw.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const NAME     = process.env.ADMIN_NAME     || 'Super Admin';

async function run() {
  const client = await pool.connect();
  try {
    // Check if user already exists
    const existing = await client.query('SELECT id FROM users WHERE email = $1', [EMAIL]);
    let userId: string;

    if (existing.rows.length > 0) {
      userId = existing.rows[0].id;
      console.log(`User ${EMAIL} already exists — skipping creation.`);
    } else {
      const hash = await bcrypt.hash(PASSWORD, 12);
      const { rows } = await client.query(
        `INSERT INTO users (email, password_hash, full_name, role)
         VALUES ($1, $2, $3, 'SUPER_ADMIN') RETURNING id`,
        [EMAIL, hash, NAME]
      );
      userId = rows[0].id;
      console.log(`✅ Created user: ${EMAIL}`);
    }

    // Assign super_admin role in the RBAC table
    const { rows: roles } = await client.query(
      `SELECT id FROM roles WHERE name = 'super_admin'`
    );
    if (roles.length === 0) {
      console.error('❌ super_admin role not found — did you run migrations?');
      process.exit(1);
    }

    await client.query(
      `INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [userId, roles[0].id]
    );
    console.log(`✅ Assigned super_admin role`);
    console.log(`\n  Email:    ${EMAIL}`);
    console.log(`  Password: ${PASSWORD}`);
    console.log(`\n⚠️  Change the password immediately after first login.\n`);
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
