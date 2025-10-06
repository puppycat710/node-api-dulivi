import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class ProductRepository {
	// Criar produto
	async create(productData) {
		try {
			const result = await turso.execute(
				`INSERT INTO products (title, description, price, image, servings, weight_grams, fk_store_categories_id, fk_store_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
				[
					productData.title,
					productData.description,
					productData.price,
					productData.image ?? null,
					productData.servings ?? null,
					productData.weight_grams ?? null,
					productData.fk_store_categories_id,
					productData.fk_store_id,
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
				`SELECT * FROM products WHERE fk_store_id = ?`,
				[fk_store_id]
			)
			return result.rows.length ? result.rows : null
		} catch (error) {
			throw error
		}
	}
	// Encontrar por titulo
	async getByTitle(fk_store_id, title) {
		try {
			const result = await turso.execute(
				`SELECT * FROM products WHERE LOWER(title) = ? AND fk_store_id = ?`,
				[title.toLowerCase(), fk_store_id]
			)
			//Retorno
			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM products WHERE id = ?`, [id])

			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			throw error
		}
	}
	// Atualizar produto
	async update(id, productData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(productData)
			const values = Object.values(productData)

			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE products SET ${setClause} WHERE id = ?`

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
		const result = await turso.execute(`DELETE FROM products WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new ProductRepository()
