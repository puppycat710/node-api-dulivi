import { Customer } from 'mercadopago'
import client from '../config/mercadopago.js'

export const update = async (customerId, body) => {
	const customer = new Customer(client)

	try {
		return await customer.update({
			customerId: customerId,
			body: body,
		})
	} catch (error) {
		console.error('Erro ao atualizar cliente:', error)
		if (error.status === 404) {
			return null
		}
		throw error
	}
}
