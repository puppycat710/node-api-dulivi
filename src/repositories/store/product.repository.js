import { getTursoClient } from '../../lib/turso.js'
import { createSlug } from '../../utils/createSlug.js'

const turso = getTursoClient()

class ProductRepository {
	// Criar produto
	async create(productData) {
		try {
			const { title, description, price, image, servings, weight_grams, fk_store_categories_id, fk_store_id } = productData
			const slug = await this.generateUniqueSlug(title)

			const result = await turso.execute(
				`INSERT INTO products 
					(title, description, price, image, servings, weight_grams, fk_store_categories_id, fk_store_id, slug)
				 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
				 RETURNING *`,
				[
					title,
					description,
					price,
					image ?? null,
					servings ?? null,
					weight_grams ?? null,
					fk_store_categories_id,
					fk_store_id,
					slug,
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
	// Encontrar por slug
	async getBySlug(slug) {
		try {
			const result = await turso.execute(`SELECT * FROM products WHERE slug = ?`, [slug])
			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			console.error('Registro não encontrado: ', error)
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
			if (!productData || Object.keys(productData).length === 0) return this.getById(id)
			const produtoAtual = await this.getById(id)
			// Atualiza slug se o nome mudou
			if (productData?.title && productData.title !== produtoAtual.title) {
				productData.slug = await this.generateUniqueSlug(productData.title)
			}
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
	// Função utilitária para gerar slug único
	async generateUniqueSlug(name) {
		const baseSlug = createSlug(name)
		let slug = baseSlug

		const result = await turso.execute(`SELECT slug FROM products WHERE slug LIKE ?`, [`${baseSlug}%`])
		const existingSlugs = result.rows.map((r) => r.slug)

		if (existingSlugs.includes(baseSlug)) {
			let counter = 2
			while (existingSlugs.includes(`${baseSlug}-${counter}`)) counter++
			slug = `${baseSlug}-${counter}`
		}

		return slug
	}
}

export default new ProductRepository()
