CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    verification_code TEXT,
    code_expires_at DATETIME,
    card_id TEXT,
    customer_id TEXT,
    fk_store_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE
);