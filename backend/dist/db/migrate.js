"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pool_1 = __importDefault(require("./pool"));
const MIGRATIONS_DIR = path_1.default.join(__dirname, 'migrations');
async function runMigrations() {
    const client = await pool_1.default.connect();
    try {
        // Create migrations tracking table
        await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
        const files = fs_1.default.readdirSync(MIGRATIONS_DIR)
            .filter(f => f.endsWith('.sql'))
            .sort();
        for (const file of files) {
            const { rows } = await client.query('SELECT id FROM _migrations WHERE filename = $1', [file]);
            if (rows.length > 0) {
                console.log(`  ✓ ${file} (already applied)`);
                continue;
            }
            const sql = fs_1.default.readFileSync(path_1.default.join(MIGRATIONS_DIR, file), 'utf-8');
            await client.query('BEGIN');
            try {
                await client.query(sql);
                await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file]);
                await client.query('COMMIT');
                console.log(`  ✅ ${file}`);
            }
            catch (err) {
                await client.query('ROLLBACK');
                throw new Error(`Migration ${file} failed: ${err}`);
            }
        }
        console.log('\nAll migrations complete.');
    }
    finally {
        client.release();
        await pool_1.default.end();
    }
}
runMigrations().catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map