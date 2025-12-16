import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class CityRepository {
	// Criar cidade
	async create(cityData) {
		try {
			const result = await turso.execute(
				`INSERT INTO store_cities (name, fk_store_id)
         VALUES (?, ?) RETURNING *`,
				[cityData.name, cityData.fk_store_id]
			)

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Encontrar cidades
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(`SELECT * FROM store_cities WHERE fk_store_id = ?`, [fk_store_id])
			return result.rows
		} catch (error) {
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM store_cities WHERE id = ?`, [id])

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Atualizar cidade
	async update(id, cityData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(cityData)
			const values = Object.values(cityData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE store_cities SET ${setClause} WHERE id = ?`
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
	// Deletar cidade
	async delete(id) {
		const result = await turso.execute(`DELETE FROM store_cities WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new CityRepository()
