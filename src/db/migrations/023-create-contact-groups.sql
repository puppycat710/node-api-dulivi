CREATE TABLE contact_groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fk_group_id INTEGER NOT NULL,
  fk_contact_id INTEGER NOT NULL,
  fk_store_id INTEGER NOT NULL,
  FOREIGN KEY (fk_group_id) REFERENCES groups(id) ON DELETE CASCADE,
  FOREIGN KEY (fk_contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (fk_store_id) REFERENCES stores(id) ON DELETE CASCADE,
  UNIQUE (fk_contact_id, fk_group_id, fk_store_id)
);
