import express from 'express'
import axios from 'axios'
import { getRedisClient } from '../lib/redis.js' // seu arquivo de conexão Redis

const router = express.Router()

// Rota para retornar todos os estados
router.get('/api/estados', async (req, res) => {
	try {
		const redisClient = await getRedisClient()

		// Verifica se os estados estão no cache
		const cachedEstados = await redisClient.get('ibge:estados')
		if (cachedEstados) {
			return res.status(200).json({
				success: true,
				message: 'Registros encontrados com sucesso!',
				data: JSON.parse(cachedEstados),
			})
		}

		// Consulta IBGE se não estiver no cache
		const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados', {
			headers: { 'Accept-Encoding': 'identity' },
			timeout: 15000,
		})

		const estados = response.data.sort((a, b) => a.nome.localeCompare(b.nome))

		// Salva no cache por 24h (86400 segundos)
		await redisClient.set('ibge:estados', JSON.stringify(estados))

		res.status(200).json({
			success: true,
			message: 'Registros encontrados com sucesso!',
			data: estados,
		})
	} catch (err) {
		console.error('Erro ao buscar estados:', err.message)
		res.status(500).json({ success: false, err: 'Erro ao buscar registros!' })
	}
})

// Rota para retornar cidades de um estado específico
router.get('/api/cidades/:id', async (req, res) => {
	const { id } = req.params
	if (!id) return res.status(400).json({ success: false, message: 'Estado não informado!' })

	try {
		const redisClient = await getRedisClient()
		const cacheKey = `ibge:cidades:${id}`

		// Verifica se as cidades estão no cache
		const cachedCidades = await redisClient.get(cacheKey)
		if (cachedCidades) {
			return res.status(200).json({
				success: true,
				message: 'Registros encontrados com sucesso!',
				data: JSON.parse(cachedCidades),
			})
		}

		// Consulta IBGE se não estiver no cache
		const response = await axios.get(
			`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${id}/municipios`,
			{ headers: { 'Accept-Encoding': 'identity' }, timeout: 15000 }
		)

		const cidades = response.data.sort((a, b) => a.nome.localeCompare(b.nome))

		// Salva no cache por 24h
		await redisClient.set(cacheKey, JSON.stringify(cidades))

		res.status(200).json({
			success: true,
			message: 'Registros encontrados com sucesso!',
			data: cidades,
		})
	} catch (err) {
		console.error(`Erro ao buscar cidades de ${id}:`, err.message)
		res.status(500).json({ success: false, message: 'Erro ao buscar registros!' })
	}
})

export default router
