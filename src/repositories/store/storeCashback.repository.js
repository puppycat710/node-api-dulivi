import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class StoreCashbackRepository {
	// Criar registro
	async create(storeCashbackData) {
		const { is_active, percentage, minimum_order_value, fk_store_id } = storeCashbackData
		try {
			const result = await turso.execute(
				`INSERT INTO store_cashback (is_active, percentage, minimum_order_value, fk_store_id) 
         VALUES (?, ?, ?, ?) RETURNING *`,
				[
					is_active,
					percentage,
					minimum_order_value,
					fk_store_id,
				]
			)
			//Retorno
			return result.rows[0]
		} catch (error) {
			console.error('Não foi possível cadastrar o registro', error)
			throw error
		}
	}
	// Encontrar todas registro
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(`SELECT * FROM store_cashback WHERE fk_store_id = ?`, [fk_store_id])
			//Retorno
			return result.rows
		} catch (error) {
			console.error('Registro não encontrado', error)
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM store_cashback WHERE id = ?`, [id])
			return result.rows[0]
		} catch (error) {
			console.error('Registro não encontrado', error)
			throw error
		}
	}
	// Atualizar registro
	async update(id, storeCashbackData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(storeCashbackData)
			const values = Object.values(storeCashbackData)

			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE store_cashback SET ${setClause} WHERE id = ?`

			// Adicionar o ID no final dos valores
			values.push(id)

			const result = await turso.execute(query, values)
			if (result.affectedRows === 0) {
				throw error
			}

			return this.getById(id) // Retorna o registro atualizado
		} catch (error) {
			console.error('Erro ao atualizar registro:', error)
			throw error
		}
	}
	// Deletar registro
	async delete(id) {
		const result = await turso.execute(`DELETE FROM store_cashback WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new StoreCashbackRepository()
