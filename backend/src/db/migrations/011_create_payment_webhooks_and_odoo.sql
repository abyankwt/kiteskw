-- Raw payment webhook log (idempotency + audit trail)
CREATE TABLE IF NOT EXISTS payment_webhooks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id   UUID REFERENCES payments(id) ON DELETE SET NULL,
  raw_payload  JSONB NOT NULL,
  source_ip    VARCHAR(50),
  processed    BOOLEAN NOT NULL DEFAULT false,
  processed_at TIMESTAMPTZ,
  error        TEXT,
  received_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_webhooks_payment   ON payment_webhooks(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_webhooks_processed ON payment_webhooks(processed, received_at);

-- Durable outbox for future Odoo ERP sync
CREATE TABLE IF NOT EXISTS odoo_sync_queue (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(100) NOT NULL,
  entity_id   UUID NOT NULL,
  operation   VARCHAR(50) NOT NULL,
  payload     JSONB NOT NULL,
  status      VARCHAR(50) NOT NULL DEFAULT 'pending',
  attempts    INTEGER NOT NULL DEFAULT 0,
  last_error  TEXT,
  synced_at   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_odoo_sync_status ON odoo_sync_queue(status, entity_type);
CREATE INDEX IF NOT EXISTS idx_odoo_sync_entity ON odoo_sync_queue(entity_type, entity_id);
