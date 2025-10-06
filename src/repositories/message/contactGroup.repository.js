import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class ContactGroupRepository {
	// Criar registro
	async upsert(contactGroupData) {
		const { fk_contact_id, fk_group_id, fk_store_id } = contactGroupData
		try {
			const result = await turso.execute(
				`INSERT INTO contact_groups (fk_contact_id, fk_group_id, fk_store_id)
       VALUES (?, ?, ?)
       ON CONFLICT(fk_contact_id, fk_group_id, fk_store_id)
       DO UPDATE SET 
         fk_contact_id = excluded.fk_contact_id,
         fk_group_id = excluded.fk_group_id,
         fk_store_id = excluded.fk_store_id
       RETURNING *`,
				[fk_contact_id, fk_group_id, fk_store_id]
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
				`SELECT * FROM contact_groups WHERE fk_store_id = ?`,
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
			const result = await turso.execute(
				`SELECT * FROM contact_groups WHERE id = ?`,
				[id]
			)

			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Atualizar registro
	async update(id, contactGroupData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(contactGroupData)
			const values = Object.values(contactGroupData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE contact_groups SET ${setClause} WHERE id = ?`
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
		const result = await turso.execute(
			`DELETE FROM contact_groups WHERE id = ?`,
			[id]
		)
		return result.affectedRows > 0
	}
	async deleteByContact(fk_contact_id, fk_store_id) {
		const result = await turso.execute(
			`DELETE FROM contact_groups WHERE fk_contact_id = ? AND fk_store_id = ?`,
			[fk_contact_id, fk_store_id]
		)
		return result.affectedRows > 0
	}
	async deleteByGroup(fk_group_id, fk_store_id) {
		const result = await turso.execute(
			`DELETE FROM contact_groups WHERE fk_group_id = ? AND fk_store_id = ?`,
			[fk_group_id, fk_store_id]
		)
		return result.affectedRows > 0
	}
	// Busca contatos de um grupo
	async getContactsByGroupId(groupId) {
		const result = await turso.execute(
			`SELECT c.* 
				 FROM contacts c
				 INNER JOIN contact_groups cg ON c.id = cg.fk_contact_id
				 WHERE cg.fk_group_id = ?`,
			[groupId]
		)
		return result.rows
	}
}

export default new ContactGroupRepository()
