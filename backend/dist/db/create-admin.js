"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * One-time script to create the first Super Admin user.
 * Run AFTER migrations:
 *   npx ts-node src/db/create-admin.ts
 */
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const pool_1 = __importDefault(require("./pool"));
const EMAIL = process.env.ADMIN_EMAIL || 'admin@kites-kw.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const NAME = process.env.ADMIN_NAME || 'Super Admin';
async function run() {
    const client = await pool_1.default.connect();
    try {
        // Check if user already exists
        const existing = await client.query('SELECT id FROM users WHERE email = $1', [EMAIL]);
        let userId;
        if (existing.rows.length > 0) {
            userId = existing.rows[0].id;
            console.log(`User ${EMAIL} already exists — skipping creation.`);
        }
        else {
            const hash = await bcryptjs_1.default.hash(PASSWORD, 12);
            const { rows } = await client.query(`INSERT INTO users (email, password_hash, full_name, role)
         VALUES ($1, $2, $3, 'SUPER_ADMIN') RETURNING id`, [EMAIL, hash, NAME]);
            userId = rows[0].id;
            console.log(`✅ Created user: ${EMAIL}`);
        }
        // Assign super_admin role in the RBAC table
        const { rows: roles } = await client.query(`SELECT id FROM roles WHERE name = 'super_admin'`);
        if (roles.length === 0) {
            console.error('❌ super_admin role not found — did you run migrations?');
            process.exit(1);
        }
        await client.query(`INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [userId, roles[0].id]);
        console.log(`✅ Assigned super_admin role`);
        console.log(`\n  Email:    ${EMAIL}`);
        console.log(`  Password: ${PASSWORD}`);
        console.log(`\n⚠️  Change the password immediately after first login.\n`);
    }
    finally {
        client.release();
        await pool_1.default.end();
    }
}
run().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
//# sourceMappingURL=create-admin.js.map