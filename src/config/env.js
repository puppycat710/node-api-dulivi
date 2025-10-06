import dotenv from 'dotenv'
dotenv.config()

export const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL
export const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN
export const SUPABASE_API_KEY = process.env.SUPABASE_API_KEY
export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
export const JWT_SECRET = process.env.JWT_SECRET
