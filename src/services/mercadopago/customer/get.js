import { Customer } from 'mercadopago'

export const get = async (client, customerId) => {
	const customer = new Customer(client)

	try {
		return await customer.get({ customerId: customerId })
	} catch (error) {
		console.error('Erro ao buscar cliente:', error)
		if (error.status === 404) {
			return null
		}
		throw error
	}
}
