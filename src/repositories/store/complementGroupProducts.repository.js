import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class ComplementGroupProductsRepository {
	// Criar registro
	async upsert({ fk_product_id, fk_complement_group_id, fk_store_id }) {
		try {
			const result = await turso.execute(
				`INSERT INTO complement_group_products 
         (fk_product_id, fk_complement_group_id, fk_store_id)
       VALUES (?, ?, ?)
       ON CONFLICT(fk_product_id, fk_complement_group_id)
       DO UPDATE SET 
         fk_store_id = excluded.fk_store_id
       RETURNING *`,
				[fk_product_id, fk_complement_group_id, fk_store_id]
			)

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Encontrar registro
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(`SELECT * FROM complement_group_products WHERE fk_store_id = ?`, [
				fk_store_id,
			])
			return result.rows
		} catch (error) {
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM complement_group_products WHERE id = ?`, [id])

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Atualizar registro
	async update(id, complementGroupProductsData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(complementGroupProductsData)
			const values = Object.values(complementGroupProductsData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE complement_group_products SET ${setClause} WHERE id = ?`
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
		const result = await turso.execute(`DELETE FROM complement_group_products WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
	async deleteByProduct(fk_product_id, fk_store_id) {
		const result = await turso.execute(
			`DELETE FROM complement_group_products WHERE fk_product_id = ? AND fk_store_id = ?`,
			[fk_product_id, fk_store_id]
		)
		return result.affectedRows > 0
	}
	async deleteByComplementGroup(fk_complement_group_id, fk_store_id) {
		const result = await turso.execute(
			`DELETE FROM complement_group_products WHERE fk_complement_group_id = ? AND fk_store_id = ?`,
			[fk_complement_group_id, fk_store_id]
		)
		return result.affectedRows > 0
	}
	// Busca contatos de um grupo
	async getContactsByGroupId(fk_complement_group_id) {
		const result = await turso.execute(
			`SELECT c.* 
				 FROM products p
				 INNER JOIN complement_group_products cg ON p.id = cg.fk_product_id
				 WHERE cg.fk_complement_group_id = ?`,
			[fk_complement_group_id]
		)
		return result.rows
	}
}

export default new ComplementGroupProductsRepository()
