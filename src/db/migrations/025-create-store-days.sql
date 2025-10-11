CREATE TABLE store_days (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_store_id INTEGER NOT NULL,
    weekday INTEGER NOT NULL, -- 0 = Domingo, 6 = Sábado
    is_open INTEGER DEFAULT 1, -- 1 = abre neste dia, 0 = fechado
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE,
    UNIQUE (fk_store_id, weekday)
);