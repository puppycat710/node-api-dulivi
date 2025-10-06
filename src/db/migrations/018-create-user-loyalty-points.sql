CREATE TABLE IF NOT EXISTS user_loyalty_points (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_user_id INTEGER NOT NULL,
    fk_store_id INTEGER NOT NULL,
    total_points INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE,
    UNIQUE (fk_user_id, fk_store_id)
);