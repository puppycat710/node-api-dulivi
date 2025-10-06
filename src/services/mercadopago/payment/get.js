import { Payment } from 'mercadopago'

export async function get(client, paymentId) {
	const payment = new Payment(client)

	try {
		return await payment.get({ id: paymentId })
	} catch (error) {
		console.error('Erro ao buscar pagamento:', error)
		if (error.status === 404) {
			return null
		}
		throw error
	}
}
