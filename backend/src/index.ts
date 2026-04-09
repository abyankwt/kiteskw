import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import pool from './db/pool';

const PORT = parseInt(process.env.PORT || '3001');

async function start() {
  // Test DB connection
  try {
    const client = await pool.connect();
    client.release();
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 KITES API running on http://localhost:${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

start();
