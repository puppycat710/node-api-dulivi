CREATE TABLE IF NOT EXISTS product_upsells (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_product_id INTEGER NOT NULL,
    fk_upsell_product_id INTEGER NOT NULL,
    FOREIGN KEY (fk_product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (fk_upsell_product_id) REFERENCES products (id) ON DELETE CASCADE
);