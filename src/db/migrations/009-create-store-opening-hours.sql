CREATE TABLE IF NOT EXISTS store_opening_hours (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day_of_week TEXT NOT NULL,
    opens_at INTEGER,
    closes_at INTEGER,
    fk_store_id INTEGER NOT NULL,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE,
    UNIQUE (day_of_week, fk_store_id)
);