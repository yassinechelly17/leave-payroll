CREATE TABLE IF NOT EXISTS service_bootstrap (
    id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    service_slug TEXT NOT NULL DEFAULT 'leave-payroll',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO service_bootstrap (id, service_slug) VALUES (1, 'leave-payroll')
ON CONFLICT (id) DO NOTHING;
