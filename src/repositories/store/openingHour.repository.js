import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class openingHourRepository {
	// Salvar horario de atendimento
	async upsert(fk_store_id, openingHoursData) {
		try {
			for (const [day_of_week, { opens_at, closes_at }] of Object.entries(openingHoursData)) {
				if (!opens_at || !closes_at) continue

				await turso.execute(
					`INSERT INTO store_opening_hours (day_of_week, opens_at, closes_at, fk_store_id)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(day_of_week, fk_store_id)
         DO UPDATE SET opens_at = excluded.opens_at, closes_at = excluded.closes_at;`,
					[day_of_week, opens_at, closes_at, fk_store_id]
				)
			}

			return true
		} catch (error) {
			throw error
		}
	}
	// Encontrar horario de atendimento
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM store_opening_hours WHERE fk_store_id = ?`,
				[fk_store_id]
			)
			return result.rows.length ? result.rows : null
		} catch (error) {
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM store_opening_hours WHERE fk_store_id = ?`, [id])

			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			throw error
		}
	}
}
export default new openingHourRepository()
