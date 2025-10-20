import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class ComplementRepository {
	// Criar produto
	async create(complementData) {
		const { title, description, price, image, fk_store_id } = complementData

		try {
			const result = await turso.execute(
				`INSERT INTO complements (title, description, price, image, fk_store_id)
         VALUES (?, ?, ?, ?, ?) RETURNING *`,
				[
					title,
					description ?? null,
				  price ?? null,
					image ?? null,
					fk_store_id
				]
			)
			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Encontrar todos produtos
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM complements WHERE fk_store_id = ?`,
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
			const result = await turso.execute(`SELECT * FROM complements WHERE id = ?`, [id])

			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			throw error
		}
	}
	// Atualizar produto
	async update(id, complementData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(complementData)
			const values = Object.values(complementData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE complements SET ${setClause} WHERE id = ?`
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
	// Deletar produto
	async delete(id) {
		const result = await turso.execute(`DELETE FROM complements WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new ComplementRepository()
