CREATE TABLE IF NOT EXISTS complement_group_complements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fk_complement_id INTEGER NOT NULL,
    fk_complement_group_id INTEGER NOT NULL,
    fk_store_id INTEGER NOT NULL,
    FOREIGN KEY (fk_complement_id) REFERENCES complements (id) ON DELETE CASCADE,
    FOREIGN KEY (fk_complement_group_id) REFERENCES complement_groups (id) ON DELETE CASCADE,
    FOREIGN KEY (fk_store_id) REFERENCES stores (id) ON DELETE CASCADE,
    UNIQUE (
        fk_complement_id,
        fk_complement_group_id
    ) -- evita duplicatas
);