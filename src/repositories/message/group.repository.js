import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class GroupRepository {
	// Criar registro
	async create(groupData) {
    const { name, fk_store_id } = groupData
		try {
			const result = await turso.execute(
				`INSERT INTO groups (name, fk_store_id)
         VALUES (?, ?) RETURNING *`,
				[name, fk_store_id]
			)

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Encontrar registro
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM groups WHERE fk_store_id = ?`,
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
			const result = await turso.execute(`SELECT * FROM groups WHERE id = ?`, [id])

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Atualizar registro
	async update(id, groupData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(groupData)
			const values = Object.values(groupData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE groups SET ${setClause} WHERE id = ?`
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
		const result = await turso.execute(`DELETE FROM groups WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new GroupRepository()
