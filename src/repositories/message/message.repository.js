import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class MessageRepository {
	// Criar registro
	async create(messageData) {
		const { text, image, send_at, frequency, fk_group_id, fk_store_id } = messageData
		try {
			const result = await turso.execute(
				`INSERT INTO messages (text, image, send_at, frequency, fk_group_id, fk_store_id)
         VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
				[text, image ?? null, send_at, frequency, fk_group_id, fk_store_id]
			)

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Buscar todos
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM messages WHERE fk_store_id = ?`,
				[fk_store_id]
			)
			return result.rows
		} catch (error) {
			throw error
		}
	}
	// Buscar por ID
	async getById(id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM messages WHERE id = ?`,
				[id]
			)

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Atualizar registro
	async update(id, messageData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(messageData)
			const values = Object.values(messageData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE messages SET ${setClause} WHERE id = ?`
			// Adicionar o ID no final dos valores
			values.push(id)
			// Executar a query no Turso
			await turso.execute(query, values)
			// Retornar o usuário atualizado
			return this.getById(id)
		} catch (error) {
			throw error
		}
	}
	// Deletar registro
	async delete(id) {
		const result = await turso.execute(
			`DELETE FROM messages WHERE id = ?`,
			[id]
		)
		return result.affectedRows > 0
	}
	// Buscar todos disparos ativos
	async getActiveMessages(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT *
				FROM messages
				WHERE fk_store_id = ?
				AND (
					sent = 0
					OR frequency IN ('daily', 'weekdays')
				)
				ORDER BY send_at ASC`,
				[fk_store_id]
			)

			return result.rows
		} catch (error) {
			throw error
		}
	}
	// Buscar todas mensagens programadas
	async getScheduledMessages() {
		try {
			const now = new Date().toISOString()
			const weekday = new Date().getDay() // 0 = domingo, 6 = sábado

			const result = await turso.execute(
				`SELECT * FROM messages 
				WHERE (
					sent = 0
					OR frequency IN ('daily', 'weekdays')
				)
				AND (
					frequency = 'daily'
					OR (frequency = 'weekdays' AND ? BETWEEN 1 AND 5)
					OR frequency = 'once'
				)
				AND send_at <= ?
				ORDER BY send_at ASC`,
				[weekday, now]
			)

			return result.rows
		} catch (error) {
			throw error
		}
	}
}

export default new MessageRepository()
