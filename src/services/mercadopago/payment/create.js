import { Payment } from 'mercadopago'
import { v4 as uuidv4 } from 'uuid'

export const create = async (client, reqBody) => {
	const { transaction_amount, token, email, cpf, payment_method_id } = reqBody

	const products = [
		{
			id: 'MLB2907679857',
			title: 'Point Mini',
			description: 'Point product for card payments via Bluetooth.',
			picture_url:
				'https://http2.mlstatic.com/resources/frontend/statics/growth-sellers-landings/device-mlb-point-i_medium2x.png',
			category_id: 'electronics',
			quantity: 1,
			unit_price: 58,
		},
	]

	const body = {
		additional_info: {
			items: products,
			payer: {
				first_name: 'Test',
				last_name: 'Test',
				phone: { area_code: '11', number: '987654321' },
				address: { street_number: null },
			},
			shipments: {
				receiver_address: {
					zip_code: '12312-123',
					state_name: 'Rio de Janeiro',
					city_name: 'Buzios',
					street_name: 'Av das Nacoes Unidas',
					street_number: 3003,
				},
			},
		},
		application_fee: null,
		binary_mode: false,
		capture: false,
		description: 'Payment for product',
		external_reference: 'MP0001',
		installments: 1,
		payer: {
			entity_type: 'individual',
			type: 'customer',
			email: email,
			identification: { type: 'CPF', number: cpf },
		},
		payment_method_id: payment_method_id,
		token: token,
		transaction_amount: transaction_amount,
	}

	try {
		return await new Payment(client).create({
			body: body,
			requestOptions: { idempotencyKey: uuidv4() },
		})
	} catch (error) {
		console.error('Erro ao criar pagamento:', error)
		if (error.status === 404) {
			return null
		}
		throw error
	}
}
