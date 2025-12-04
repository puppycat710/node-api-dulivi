import { createClient } from 'redis'

const client = createClient({
	url: 'rediss://default:AayvAAIncDJmNmQ0M2IxZTk0NTY0NDcxYmYwNmE0YjEwMGY4YzU1MHAyNDQyMDc@exotic-louse-44207.upstash.io:6379',
})

client.on('error', (err) => {
	console.error('Erro ao conectar no Redis:', err)
})

// Exporta uma função para garantir conexão única
let isConnected = false

export async function getRedisClient() {
	if (!isConnected) {
		await client.connect()
		isConnected = true
	}
	return client
}
