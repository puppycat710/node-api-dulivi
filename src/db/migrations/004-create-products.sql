CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT,
  servings INTEGER,
  weight_grams INTEGER,
  fk_store_categories_id INTEGER NOT NULL,
  fk_store_id INTEGER NOT NULL,
  FOREIGN KEY (fk_store_categories_id) REFERENCES store_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (fk_store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE (title, fk_store_id)
);
