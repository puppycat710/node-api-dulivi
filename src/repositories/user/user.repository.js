import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class UserRepository {
	// Criar usuário
	async create(userData) {
		try {
			const result = await turso.execute(
				`INSERT INTO users (name, whatsapp, verification_code, code_expires_at, card_id, customer_id, fk_store_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`,
				[
					userData.name,
					userData.whatsapp,
					userData.verification_code,
					userData.code_expires_at,
					userData.card_id || null,
					userData.customer_id || null,
					userData.fk_store_id,
				]
			)
			return result.rows[0]
		} catch (error) {
			console.error('Não foi possível cadastrar o usuário', error)
			throw error
		}
	}
	// Encontrar todos usuários
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(`SELECT * FROM users WHERE fk_store_id = ?`, [
				fk_store_id,
			])
			return result.rows.length ? result.rows : null
		} catch (error) {
			console.error('Não foi possível localizar os usuários', error)
			throw error
		}
	}
	// Encontrar por email
	async getByEmail(email, fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM users WHERE email = ? AND fk_store_id = ?`,
				[email, fk_store_id]
			)
			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			console.error('Usuário não encontrado', error)
			throw error
		}
	}
	// Encontrar por celular
	async getByPhone(whatsapp, fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM users WHERE whatsapp = ? AND fk_store_id = ?`,
				[whatsapp, fk_store_id]
			)
			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			console.error('Usuário não encontrado', error)
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM users WHERE id = ?`, [id])
			if (!result.rows.length) {
				console.error('Usuário não encontrado', error)
			}
			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			console.error('Usuário não encontrado', error)
			throw error
		}
	}
	// Atualizar usuário
	async update(id, userData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(userData)
			const values = Object.values(userData)

			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE users SET ${setClause} WHERE id = ?`

			// Adicionar o ID no final dos valores
			values.push(id)

			// Executar a query no Turso
			await turso.execute(query, values)

			// Retornar o usuário atualizado
			return this.getById(id)
		} catch (error) {
			console.error('Erro ao atualizar usuário:', error)
			throw error
		}
	}
	// Deletar usuário
	async delete(userId) {
		try {
			await turso.execute(`DELETE FROM users WHERE id = ?`, [userId])
			return { message: 'Usuário deletado com sucesso' }
		} catch (error) {
			console.error('Não foi possível deletar o usuário', error)
			throw error
		}
	}
}

export default new UserRepository()
