import axios from 'axios'

export const api = axios.create({
	baseURL: 'https://node-api-dulivi-whatsapp-bot-production.up.railway.app/api/whatsapp',
})
