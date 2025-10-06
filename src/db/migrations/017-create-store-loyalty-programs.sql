CREATE TABLE IF NOT EXISTS store_loyalty_programs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    is_active BOOLEAN DEFAULT FALSE,
    points_per_currency NUMERIC DEFAULT 1, -- ex: 1 ponto por R$1
    fk_store_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE
);