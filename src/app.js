import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

import routes from './routes/index.js'
import './jobs/scheduler.js'

export const corsOptions = {
	origin: [
		// Domínios permitidos
		'https://dulivii.netlify.app', // Cardápio Digital production
		'https://cardapio-digital-api-nzm1.onrender.com', // API production
		'https://node-api-dulivi-whatsapp-bot-production.up.railway.app/', // API production
		'http://localhost:3000', // API development
		'http://localhost:5173', // Cardápio Digital development
	],
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}
const urls = [
	// Domínios permitidos
	'https://dulivi.netlify.app', // Cardápio Digital production
	'https://cardapio-digital-api-nzm1.onrender.com', // API production
	'http://localhost:3000', // API development
	'http://localhost:5173', // Cardápio Digital development
]
const app = express()

app.use(morgan('tiny'))
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.use(routes)

export default app
