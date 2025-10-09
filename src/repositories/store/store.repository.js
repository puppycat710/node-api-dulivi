import { decrypt } from '../../lib/crypto.js'
import { getTursoClient } from '../../lib/turso.js'
import { createSlug } from '../../utils/createSlug.js'

const turso = getTursoClient()

class StoreRepository {
	async create(storeData) {
		const slug = createSlug(storeData.name)

		try {
			const result = await turso.execute(
				`INSERT INTO stores (name, email, password, image, slug, minimum_order, delivery_time_min, delivery_time_max, store_location, subscription_status, subscription_expires_at) 
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', DATETIME('now', '+14 days')) 
				RETURNING *`,
				[
					storeData.name,
					storeData.email,
					storeData.password,
					storeData.image || 'default.png',
					slug,
					storeData.minimum_order || 15,
					storeData.default_delivery_fee || 5,
					storeData.delivery_time_min || 90,
					storeData.delivery_time_max || 120,
					storeData.store_location || 'São Paulo, SP',
				]
			)
			return result.rows[0]
		} catch (error) {
			console.error('Não foi possível cadastrar um novo registro: ', error)
			throw error
		}
	}
	// Encontrar por email
	async getByEmail(email) {
		try {
			const result = await turso.execute(`SELECT * FROM stores WHERE email = ?`, [email])
			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			console.error('Registro não encontrado: ', error)
			throw error
		}
	}
	// Encontrar por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM stores WHERE id = ?`, [id])
			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			console.error('Registro não encontrado: ', error)
			throw error
		}
	}
	// Encontrar por slug
	async getBySlug(slug) {
		try {
			const result = await turso.execute(`SELECT * FROM stores WHERE slug = ?`, [slug])
			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			console.error('Registro não encontrado: ', error)
			throw error
		}
	}
	// Encontrar token
	async getToken(id) {
		try {
			const result = await turso.execute(`SELECT mercadopago_access_token FROM stores WHERE id = ?`, [id])

			const rows = result.rows
			if (!rows || rows.length === 0) {
				return null // ou lance erro, se preferir
			}

			const encryptedToken = rows[0].mercadopago_access_token
			if (!encryptedToken) {
				return null
			}

			const access_token = decrypt(encryptedToken)
			
			return access_token
		} catch (error) {
			console.error('Erro ao buscar token:', error)
			throw error
		}
	}
	// Atualizar loja
	async update(id, storeData) {
		try {
			const lojaAtual = await this.getById(id)
			// Se o nome for alterado, atualize o slug
			if (storeData?.name && storeData.name !== lojaAtual.name) {
				storeData.slug = createSlug(storeData.name)
			}
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(storeData)
			const values = Object.values(storeData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE stores SET ${setClause} WHERE id = ?`
			// Adicionar o ID no final dos valores
			values.push(id)
			// Executar a query no Turso
			await turso.execute(query, values)
			// Retornar o usuário atualizado
			return this.getById(id)
		} catch (error) {
			console.error('Erro ao atualizar registro: ', error)
			throw error
		}
	}
	// Deletar loja
	async delete(id) {
		const result = await turso.execute(`DELETE FROM stores WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new StoreRepository()
