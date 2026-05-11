"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueSync = queueSync;
exports.getPendingQueue = getPendingQueue;
exports.markSynced = markSynced;
exports.markFailed = markFailed;
const pool_1 = __importDefault(require("../db/pool"));
const ODOO_ENABLED = process.env.ODOO_SYNC_ENABLED === 'true';
// Push an event to the durable outbox. The actual sync worker reads this table.
// When Odoo integration is activated, set ODOO_SYNC_ENABLED=true and implement
// the worker in odoo.worker.ts that calls Odoo's XML-RPC / JSON-RPC API.
async function queueSync(entityType, entityId, operation, payload) {
    if (!ODOO_ENABLED)
        return; // no-op until enabled
    await pool_1.default.query(`INSERT INTO odoo_sync_queue (entity_type, entity_id, operation, payload)
     VALUES ($1, $2, $3, $4)`, [entityType, entityId, operation, JSON.stringify(payload)]);
}
async function getPendingQueue(limit = 50) {
    const { rows } = await pool_1.default.query(`SELECT * FROM odoo_sync_queue
     WHERE status = 'pending' AND attempts < 5
     ORDER BY created_at ASC
     LIMIT $1`, [limit]);
    return rows;
}
async function markSynced(id) {
    await pool_1.default.query(`UPDATE odoo_sync_queue SET status = 'synced', synced_at = NOW() WHERE id = $1`, [id]);
}
async function markFailed(id, error) {
    await pool_1.default.query(`UPDATE odoo_sync_queue
     SET status = 'failed', attempts = attempts + 1, last_error = $1
     WHERE id = $2`, [error, id]);
}
//# sourceMappingURL=odoo.service.js.map