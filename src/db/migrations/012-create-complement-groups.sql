CREATE TABLE IF NOT EXISTS complement_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    option_limit INTEGER DEFAULT 20,
    multiple_selection TEXT DEFAULT 'true',
    allow_quantity_per_item TEXT DEFAULT 'false',
    required TEXT DEFAULT 'false',
    fk_store_id INTEGER NOT NULL,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE
);