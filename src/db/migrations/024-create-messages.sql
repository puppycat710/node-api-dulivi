CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    image TEXT,
    send_at TEXT NOT NULL,
    sent INTEGER DEFAULT 0,
    frequency TEXT DEFAULT 'once', -- 'once', 'daily', 'weekdays'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_group_id INTEGER NOT NULL,
    fk_store_id INTEGER NOT NULL,
    FOREIGN KEY (fk_group_id) REFERENCES groups (id) ON DELETE CASCADE,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE
);