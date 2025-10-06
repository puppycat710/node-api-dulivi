CREATE TABLE IF NOT EXISTS store_coupons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    description TEXT,
    discount_type TEXT NOT NULL CHECK (
        discount_type IN ('fixed', 'percentage')
    ),
    discount_value NUMERIC NOT NULL,
    minimum_order_value NUMERIC DEFAULT 0,
    max_uses INTEGER DEFAULT 0, -- 0 = ilimitado
    expires_at DATETIME,
    is_active BOOLEAN DEFAULT TRUE,
    fk_store_id INTEGER NOT NULL,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE,
    UNIQUE (code, fk_store_id)
);