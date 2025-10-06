import { get as getPayment } from '../services/mercadopago/payment/get.js'

export default async function checkPaymentStatus(mercadopago_pay_id) {
	if (!mercadopago_pay_id) {
		return {
			success: false,
			status: 'missing_id',
			message: 'ID do pagamento não fornecido',
		}
	}

	try {
		const payment = await getPayment(mercadopago_pay_id)

		if (!payment) {
			return {
				success: false,
				status: 'not_found',
				message: 'Pagamento não encontrado',
			}
		}

		if (payment.status === 'approved') {
			return {
				success: true,
				status: 'approved',
				data: payment,
			}
		}

		return {
			success: false,
			status: payment.status,
			message: `Pagamento com status: ${payment.status}`,
			data: payment,
		}
	} catch (error) {
		console.error('Erro ao verificar status do pagamento:', error)
		return {
			success: false,
			status: 'error',
			message: 'Erro ao verificar status do pagamento',
		}
	}
}
