import { Customer } from 'mercadopago'

export const create = async (client, reqBody) => {
	console.log(reqBody)
	const customer = new Customer(client)

	const body = {
		email: reqBody.email,
		first_name: reqBody.first_name,
		last_name: reqBody.last_name,
		phone: {
			area_code: reqBody.area_code,
			number: reqBody.phone,
		},
		identification: {
			type: 'CPF',
			number: reqBody.cpf,
		},
		default_address: 'Home',
		address: {
			id: reqBody.id_address,
			zip_code: reqBody.cep,
			street_name: reqBody.street,
			street_number: parseInt(reqBody.number, 10),
			city: {
				name: 'Praia Grande',
			},
			state: {
				id: 'BR-SP',
				name: 'São Paulo',
			},
			country: {
				id: 'BR',
				name: 'Brasil',
			},
		},
		date_registered: '2021-10-20T11:37:30.000-04:00',
		description: 'Description del user',
		default_card: 'None',
	}

	try {
		return await customer.create({ body })
	} catch (error) {
		console.error('Erro ao criar cliente:', error)
		if (error.status === 404) {
			return null
		}
		throw error
	}
}
