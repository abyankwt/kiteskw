import pool from '../db/pool';

const ODOO_ENABLED = process.env.ODOO_SYNC_ENABLED === 'true';

// Push an event to the durable outbox. The actual sync worker reads this table.
// When Odoo integration is activated, set ODOO_SYNC_ENABLED=true and implement
// the worker in odoo.worker.ts that calls Odoo's XML-RPC / JSON-RPC API.
export async function queueSync(
  entityType: 'user' | 'payment' | 'course' | 'enrollment',
  entityId: string,
  operation: 'create' | 'update' | 'delete',
  payload: Record<string, any>
) {
  if (!ODOO_ENABLED) return; // no-op until enabled

  await pool.query(
    `INSERT INTO odoo_sync_queue (entity_type, entity_id, operation, payload)
     VALUES ($1, $2, $3, $4)`,
    [entityType, entityId, operation, JSON.stringify(payload)]
  );
}

export async function getPendingQueue(limit = 50) {
  const { rows } = await pool.query(
    `SELECT * FROM odoo_sync_queue
     WHERE status = 'pending' AND attempts < 5
     ORDER BY created_at ASC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function markSynced(id: string) {
  await pool.query(
    `UPDATE odoo_sync_queue SET status = 'synced', synced_at = NOW() WHERE id = $1`,
    [id]
  );
}

export async function markFailed(id: string, error: string) {
  await pool.query(
    `UPDATE odoo_sync_queue
     SET status = 'failed', attempts = attempts + 1, last_error = $1
     WHERE id = $2`,
    [error, id]
  );
}
