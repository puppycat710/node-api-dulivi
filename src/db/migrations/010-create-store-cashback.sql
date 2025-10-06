CREATE TABLE IF NOT EXISTS store_cashback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    is_active BOOLEAN DEFAULT FALSE,
    percentage NUMERIC DEFAULT 0,
    minimum_order_value NUMERIC DEFAULT 0,
    fk_store_id INTEGER NOT NULL,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE
);