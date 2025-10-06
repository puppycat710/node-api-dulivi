CREATE TABLE IF NOT EXISTS coupon_usages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_coupon_id INTEGER NOT NULL,
  fk_user_id INTEGER NOT NULL,
  fk_order_id INTEGER,
  used_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (fk_coupon_id) REFERENCES store_coupons(id) ON DELETE CASCADE,
  FOREIGN KEY (fk_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (fk_order_id) REFERENCES orders(id) ON DELETE SET NULL,
  UNIQUE(fk_coupon_id, fk_user_id)
);
