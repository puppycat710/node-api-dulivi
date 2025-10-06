import { MercadoPagoConfig } from 'mercadopago'
import { v4 as uuidv4 } from 'uuid'

export function getMercadoPagoClient(accessToken) {
	return new MercadoPagoConfig({
		accessToken,
		options: {
			timeout: 10000,
			idempotencyKey: uuidv4(),
		},
	})
}
