CREATE TABLE IF NOT EXISTS store_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  image TEXT,
  fk_store_id INTEGER NOT NULL,
  FOREIGN KEY (fk_store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE (title, fk_store_id)
);
