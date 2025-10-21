import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class CategoryRepository {
	// Criar grupo de complementos
	async create(complementGroupData) {
		const { title, option_minimum, option_limit, multiple_selection, is_combo_group, required, fk_store_id } = complementGroupData

		try {
			const result = await turso.execute(
				`INSERT INTO complement_groups (title, option_minimum, option_limit, multiple_selection, is_combo_group, required, fk_store_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
				[
					title,
					option_minimum ?? 0,
					option_limit ?? 20,
					multiple_selection ?? 0,
					is_combo_group ?? 0,
					required ?? 0,
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
	// Encontrar todas grupo de complementos
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM complement_groups WHERE fk_store_id = ?`,
				[fk_store_id]
			)
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
			const result = await turso.execute(`SELECT * FROM complement_groups WHERE id = ?`, [
				id,
			])
			return result.rows[0]
		} catch (error) {
			console.error('Registro não encontrado', error)
			throw error
		}
	}
	// Atualizar grupo de complementos
	async update(id, complementGroupData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(complementGroupData)
			const values = Object.values(complementGroupData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE complement_groups SET ${setClause} WHERE id = ?`
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
	// Deletar grupo de complementos
	async delete(id) {
		const result = await turso.execute(`DELETE FROM complement_groups WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new CategoryRepository()
