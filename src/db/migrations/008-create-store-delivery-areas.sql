CREATE TABLE IF NOT EXISTS store_delivery_area (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  delivery_fee NUMERIC NOT NULL,
  delivery_time_min INTEGER NOT NULL,
  delivery_time_max INTEGER NOT NULL,
  fk_store_cities_id INTEGER NOT NULL,
  FOREIGN KEY (fk_store_cities_id) REFERENCES store_cities (id) ON DELETE CASCADE
)