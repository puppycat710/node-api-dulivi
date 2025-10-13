import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class DeliveryAreaRepository {
	// Criar area de entrega
	async create(deliveryAreaData) {
		const { name, delivery_fee, delivery_time_min, delivery_time_max, fk_store_cities_id, fk_store_id } = deliveryAreaData
		try {
			const result = await turso.execute(
				`INSERT INTO store_delivery_areas (name, delivery_fee, delivery_time_min, delivery_time_max, fk_store_cities_id, fk_store_id)
         VALUES (?, ?, ?, ?, ?, ?) RETURNING *`,
				[
					name,
					delivery_fee,
					delivery_time_min,
					delivery_time_max,
					fk_store_cities_id,
					fk_store_id
				]
			)

			return result.rows[0]
		} catch (error) {
			console.error('Não foi possível cadastrar a área de entrega', error)
			throw error
		}
	}
	// Encontrar areas de entrega
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM store_delivery_areas WHERE fk_store_id = ?`,
				[fk_store_id]
			)
			return result.rows
		} catch (error) {
			console.error('Não foi possível localizar os bairros', error)
			throw error
		}
	}
	// Encontrar areas de entrega
	async getById(id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM store_delivery_areas WHERE id = ?`,
				[id]
			)
			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Atualizar area de entrega
	async update(id, deliveryAreaData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(deliveryAreaData)
			const values = Object.values(deliveryAreaData)

			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE store_delivery_areas SET ${setClause} WHERE id = ?`

			// Adicionar o ID no final dos valores
			values.push(id)

			// Executar a query no Turso
			const result = await turso.execute(query, values)
			if (result.affectedRows === 0) {
				throw error
			}

			// Retornar o usuário atualizado
			return this.getById(id)
		} catch (error) {
			console.error('Erro ao atualizar bairro: ', error)
			throw error
		}
	}
	// Deletar bairro
	async delete(id) {
		const result = await turso.execute(
			`DELETE FROM store_delivery_areas WHERE id = ?`,
			[id]
		)
		return result.affectedRows > 0
	}
}

export default new DeliveryAreaRepository()
