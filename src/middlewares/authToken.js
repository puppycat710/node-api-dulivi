import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'

const SECRET = JWT_SECRET

export default function authToken(req, res, next) {
	const authHeader = req.headers['authorization'] || req.headers['Authorization']

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		console.log('Token ausente ou malformado')
		return res.status(401).json({ error: 'Token ausente ou malformado' })
	}

	const token = authHeader.split(' ')[1]

	jwt.verify(token, SECRET, (err, user) => {
		if (err) {
			console.log('Erro ao verificar token:', err.message)
			return res.status(403).json({ error: 'Token inválido ou expirado' })
		}
		req.user = user
		next()
	})
}
