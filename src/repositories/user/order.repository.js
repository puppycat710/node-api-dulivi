import { getTursoClient } from '../../lib/turso.js'

const turso = getTursoClient()

class OrderRepository {
	// Criar pedido
	async create(orderData) {
		try {
			const result = await turso.execute(
				`INSERT INTO orders (total_amount, delivery_fee, delivery_method, is_scheduled, scheduled_for, delivery_address, payment_method, customer_name, customer_whatsapp, paid, status, mercadopago_pay_id, created_at, fk_store_delivery_areas_id, fk_delivery_address_id, fk_user_id, fk_store_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`,
				[
					orderData.total_amount,
					orderData.delivery_fee ?? 7,
					orderData.delivery_method,
					orderData.is_scheduled,
					orderData.scheduled_for ?? null,
					orderData.delivery_address,
					orderData.payment_method,
					orderData.customer_name ?? null,
					orderData.customer_whatsapp ?? null,
					orderData.paid,
					orderData.status,
					orderData.mercadopago_pay_id ?? null,
					orderData.created_at,
					orderData.fk_store_delivery_areas_id ?? null,
					orderData.fk_delivery_address_id ?? null,
					orderData.fk_user_id ?? null,
					orderData.fk_store_id,
				]
			)
			return result.rows[0]
		} catch (error) {
			throw error
		}
	}
	// Encontrar pedidos
	async getAll(fk_store_id) {
		try {
			const result = await turso.execute(
				`SELECT * FROM orders WHERE fk_store_id = ? ORDER BY id DESC`,
				[fk_store_id]
			)
			return result.rows.length ? result.rows : null
		} catch (error) {
			throw error
		}
	}
	// Encontrar pedido por ID
	async getById(id) {
		try {
			const result = await turso.execute(`SELECT * FROM orders WHERE id = ?`, [id])
			return result.rows.length ? result.rows[0] : null
		} catch (error) {
			throw error
		}
	}
	// Atualizar pedido
	async update(id, orderData) {
		try {
			// Converter chaves do JSON para colunas no banco de dados
			const fields = Object.keys(orderData)
			const values = Object.values(orderData)
			// Construir a query SQL dinâmica
			const setClause = fields.map((field) => `${field} = ?`).join(', ')
			const query = `UPDATE orders SET ${setClause} WHERE id = ?`
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
	// Deletar pedido
	async delete(id) {
		const result = await turso.execute(`DELETE FROM orders WHERE id = ?`, [id])
		return result.affectedRows > 0
	}
}

export default new OrderRepository()
