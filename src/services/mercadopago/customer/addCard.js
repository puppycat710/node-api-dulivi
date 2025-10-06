import { CustomerCard } from 'mercadopago'
import { get } from './get.js'

export const addCard = async (client, token, customerId) => {
	const customer = await get(customerId)

	const cardClient = new CustomerCard(client)

	const body = {
		token: token,
		payment_method: 'credit_card',
	}

	try {
		return await cardClient.create({ customerId: customer.id, body: body })
	} catch (error) {
		console.error('Erro ao adicionar cartão ao cliente:', error)
		if (error.status === 404) {
			return null
		}
		throw error
	}
}
