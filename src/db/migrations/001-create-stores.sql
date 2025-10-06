CREATE TABLE IF NOT EXISTS stores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    image TEXT,
    slug TEXT,
    minimum_order NUMERIC,
    default_delivery_fee INTEGER,
    delivery_time_min INTEGER,
    delivery_time_max INTEGER,
    store_location TEXT NOT NULL,
    subscription_expires_at DATETIME,
    mercadopago_access_token TEXT,
    subscription_status TEXT DEFAULT 'inactive'
);