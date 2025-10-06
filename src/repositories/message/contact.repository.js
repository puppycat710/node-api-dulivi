import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class ContactRepository {
	// Criar registro
	async create(contactData) {
    const { name, contact, fk_store_id } = contactData
		try {
			const result = await turso.execute(
				`INSERT INTO contacts (name, contact, fk_store_id)
         VALUES (?, ?, ?) RETURNING *`,
				[name, contact, fk_store_id]
			)

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Encontrar registros
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM contacts WHERE fk_store_id = ?`,
				[fk_store_id]
			)
			return result.rows
		} catch (error) {
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM contacts WHERE id = ?`, [id])

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Atualizar registro
	async update(id, contactData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(contactData)
			const values = Object.values(contactData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE contacts SET ${setClause} WHERE id = ?`
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
		const result = await turso.execute(`DELETE FROM contacts WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new ContactRepository()
