import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class CategoryRepository {
	// Criar categoria
	async create(categorytData) {
		try {
			const result = await turso.execute(
				`INSERT INTO store_categories (title, image, fk_store_id) 
         VALUES (?, ?, ?) RETURNING *`,
				[categorytData.title, categorytData.image, categorytData.fk_store_id]
			)
			//Retorno
			return result.rows[0]
		} catch (error) {
			console.error('Não foi possível cadastrar o categoria', error)
			throw error
		}
	}
	// Encontrar todas categorias
	async getAll(storeId) {
		try {
			const result = await turso.execute(`SELECT * FROM store_categories WHERE fk_store_id = ?`, [storeId])
			//Retorno
			return result.rows
		} catch (error) {
			console.error('Categoria não encontrado', error)
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM store_categories WHERE id = ?`, [id])
			return result.rows[0]
		} catch (error) {
			console.error('Categoria não encontrado', error)
			throw error
		}
	}
	// Atualizar categoria
	async update(id, categorytData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(categorytData)
			const values = Object.values(categorytData)

			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE store_categories SET ${setClause} WHERE id = ?`

			// Adicionar o ID no final dos valores
			values.push(id)

			const result = await turso.execute(query, values)
			if (result.affectedRows === 0) {
				throw error
			}

			return this.getById(id) // Retorna o registro atualizado
		} catch (error) {
			console.error('Erro ao atualizar categoria:', error)
			throw error
		}
	}
	// Deletar categoria
	async delete(id) {
		const result = await turso.execute(`DELETE FROM store_categories WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new CategoryRepository()
