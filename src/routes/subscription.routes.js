import axios from 'axios'
import express from 'express'
import { getTursoClient } from '../lib/turso.js'
import { MP_ACCESS_TOKEN } from '../config/env.js'

const router = express.Router()
const turso = getTursoClient()

router.post('/subscriptions/subscribe', async (req, res) => {
	try {
		const { storeId, planSlug, payerEmail, cardToken } = req.body
		// 1️⃣ Buscar plano
		const plan = await turso.execute(`SELECT mp_plan_id FROM plans WHERE slug = ?`, [planSlug])

		if (!plan.rows.length) {
			return res.status(400).json({ error: 'Plano inválido' })
		}
		// 2️⃣ Criar assinatura COM TOKEN DA PLATAFORMA
		const response = await axios.post(
			'https://api.mercadopago.com/preapproval',
			{
				preapproval_plan_id: plan.rows[0].mp_plan_id,
				payer_email: payerEmail,
				card_token_id: cardToken,
				status: 'authorized',
				external_reference: `store_${storeId}`,
			},
			{
				headers: {
					Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
					'Content-Type': 'application/json',
				},
			}
		)
		// 3️⃣ Salvar assinatura
		await turso.execute(
			`UPDATE stores 
       SET subscription_id = ?, subscription_status = ?, plan = ?
       WHERE id = ?`,
			[response.data.id, response.data.status, planSlug, storeId]
		)

		res.json(response.data)
	} catch (err) {
		console.error(err.response?.data || err)
		res.status(500).json(err.response?.data || { error: 'Erro ao criar assinatura' })
	}
})
router.get('/subscriptions/:fk_store_id', async (req, res) => {
	try {
		const { fk_store_id } = req.params
		// 1️⃣ Buscar subscription_id no seu banco
		const result = await turso.execute(
			`SELECT subscription_id, subscription_status, plan 
       FROM stores WHERE id = ?`,
			[fk_store_id]
		)

		if (!result.rows.length || !result.rows[0].subscription_id) {
			return res.status(404).json({ error: 'Assinatura não encontrada' })
		}

		const subscriptionId = result.rows[0].subscription_id
		// 2️⃣ Consultar Mercado Pago (TOKEN DA PLATAFORMA)
		const response = await axios.get(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
			headers: {
				Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
				'Content-Type': 'application/json',
			},
		})

		res.json({
			plan: result.rows[0].plan,
			status: response.data.status,
			next_payment_date: response.data.next_payment_date,
			payment_method: response.data.payment_method_id,
			summarized: response.data.summarized,
		})
	} catch (err) {
		console.error(err.response?.data || err)
		res.status(500).json(err.response?.data || { error: 'Erro ao consultar assinatura' })
	}
})

export default router
