CREATE TABLE IF NOT EXISTS complement_group_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_complement_group_id INTEGER NOT NULL,
    fk_product_id INTEGER NOT NULL,
    fk_store_id INTEGER NOT NULL,
    FOREIGN KEY (fk_complement_group_id) REFERENCES complement_groups (id) ON DELETE CASCADE,
    FOREIGN KEY (fk_product_id) REFERENCES products (id) ON DELETE CASCADE,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE,
    UNIQUE (
        fk_complement_group_id,
        fk_product_id
    ) -- evita duplicatas
);