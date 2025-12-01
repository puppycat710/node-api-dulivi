import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import helmet from 'helmet'

import routes from './routes/index.js'
import './jobs/scheduler.js'

const urls = [
	// Domínios permitidos
	'https://menu-dulivi.netlify.app', // Cardápio production
	'https://painel-dulivi.netlify.app', // Painel production
	'https://cardapio-digital-api-nzm1.onrender.com', // API production
	'https://node-api-dulivi-whatsapp-bot-production.up.railway.app', // API production
	'https://lp-dulivi.netlify.app/', // LP
	'http://localhost:8080', // LP development
	'http://localhost:3000', // API development
	'http://localhost:5173', // Dulivi development
]

export const corsOptions = {
	origin: urls,
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
}

const app = express()

app.use(morgan('tiny'))
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.use(routes)

export default app
