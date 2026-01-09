import express from 'express'
import axios from 'axios'
import { getTursoClient } from '../lib/turso.js'
import { MP_ACCESS_TOKEN } from '../config/env.js'

const router = express.Router()
const turso = getTursoClient()

router.post('/admin/plans/start', async (req, res) => {
	try {
		const response = await axios.post(
			'https://api.mercadopago.com/preapproval_plan',
			{
				reason: 'Plano Start - Cardápio Digital',
				auto_recurring: {
					frequency: 1,
					frequency_type: 'months',
					transaction_amount: 79.9,
					currency_id: 'BRL',
				},
				back_url: 'https://painel-dulivi.netlify.app/assinatura',
			},
			{
				headers: {
					Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
					'Content-Type': 'application/json',
				},
			}
		)

		const planId = response.data.id

		await turso.execute(
			`INSERT OR REPLACE INTO plans (slug, name, price, mp_plan_id)
       VALUES (?, ?, ?, ?)`,
			['start', 'Start', 79.9, planId]
		)

		res.json({ plan: 'start', mp_plan_id: planId })
	} catch (err) {
		res.status(500).json(err.response?.data || err)
	}
})
//pro
router.post('/admin/plans/pro', async (req, res) => {
	try {
		const response = await axios.post(
			'https://api.mercadopago.com/preapproval_plan',
			{
				reason: 'Plano Pro - Cardápio Digital',
				auto_recurring: {
					frequency: 1,
					frequency_type: 'months',
					transaction_amount: 139.9,
					currency_id: 'BRL',
				},
				back_url: 'https://painel-dulivi.netlify.app/assinatura',
			},
			{
				headers: {
					Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
					'Content-Type': 'application/json',
				},
			}
		)

		const planId = response.data.id

		await turso.execute(
			`INSERT OR REPLACE INTO plans (slug, name, price, mp_plan_id)
       VALUES (?, ?, ?, ?)`,
			['pro', 'Pro', 139.9, planId]
		)

		res.json({ plan: 'pro', mp_plan_id: planId })
	} catch (err) {
		res.status(500).json(err.response?.data || err)
	}
})
// turbo
router.post('/admin/plans/turbo', async (req, res) => {
	try {
		const response = await axios.post(
			'https://api.mercadopago.com/preapproval_plan',
			{
				reason: 'Plano Turbo - Cardápio Digital',
				auto_recurring: {
					frequency: 1,
					frequency_type: 'months',
					transaction_amount: 249.9,
					currency_id: 'BRL',
				},
				back_url: 'https://painel-dulivi.netlify.app/assinatura',
			},
			{
				headers: {
					Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
					'Content-Type': 'application/json',
				},
			}
		)

		const planId = response.data.id

		await turso.execute(
			`INSERT OR REPLACE INTO plans (slug, name, price, mp_plan_id)
       VALUES (?, ?, ?, ?)`,
			['turbo', 'Turbo', 249.9, planId]
		)

		res.json({ plan: 'turbo', mp_plan_id: planId })
	} catch (err) {
		res.status(500).json(err.response?.data || err)
	}
})

export default router
