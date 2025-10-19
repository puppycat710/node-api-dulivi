CREATE TABLE IF NOT EXISTS complements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    price REAL,
    image TEXT,
    fk_complement_group_id INTEGER NOT NULL,
    fk_store_id INTEGER NOT NULL,
    FOREIGN KEY (fk_complement_group_id) REFERENCES complement_groups (id) ON DELETE CASCADE,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE
);