import userRepository from '../../repositories/user/user.repository.js'
import { api } from '../../lib/whatsapp.js'
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET

class UserController {
	// Solicitar código de verificação
	async requestCode(req, res) {
		const { name, whatsapp, fk_store_id } = req.body

		const code = Math.floor(100000 + Math.random() * 900000).toString()
		const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutos

		try {
			let user = await userRepository.getByPhone(whatsapp, fk_store_id)

			if (user) {
				await userRepository.update(user.id, {
					verification_code: code,
					code_expires_at: expiresAt,
				})
			} else {
				user = await userRepository.create({
					name,
					whatsapp,
					verification_code: code,
					code_expires_at: expiresAt,
					fk_store_id,
				})
			}

			await api.post('/send', { number: whatsapp, message: code })

			res.json({
				success: true,
				message: 'Código enviado via WhatsApp',
				data: { code },
			})
		} catch (error) {
			console.error('Erro ao solicitar código:', error)
			res.status(500).json({ success: false, error: 'Erro interno' })
		}
	}
	// Verificar código e autenticar
	async verifyCode(req, res) {
		const { whatsapp, code, fk_store_id } = req.body

		try {
			const user = await userRepository.getByPhone(whatsapp, fk_store_id)

			if (
				!user ||
				user.verification_code !== code ||
				Date.now() > user.code_expires_at
			) {
				return res
					.status(401)
					.json({ success: false, error: 'Código inválido ou expirado' })
			}
			// Gera token
			const token = jwt.sign({ id: user.id, whatsapp: user.whatsapp }, SECRET, {
				expiresIn: '7d',
			})
			res.cookie('token', token, {
				httpOnly: true,
				secure: true, // deixe true se for HTTPS
				sameSite: 'Lax',
				maxAge: 1000 * 60 * 60 * 24, // 1 dia
			})
			res.json({ success: true, data: { token, user } })
		} catch (error) {
			console.error('Erro ao verificar código:', error)
			res.status(500).json({ success: false, error: 'Erro interno' })
		}
	}
	//Buscar usuários
	async getAll(req, res) {
		const { fk_store_id } = req.body

		try {
			const users = await userRepository.getAll(fk_store_id)

			if (!users || users.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhum registro encontrado para este ID: ' + fk_store_id,
				})
			}
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registros encontrados com sucesso!',
				data: users,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar registro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar registro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Buscar usuário por ID
	async getById(req, res) {
		const { id } = req.body

		try {
			const user = await userRepository.getById(id)

			if (!user || user.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'ID não encontrado',
				})
			}
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrado com sucesso!',
				data: user,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar registro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar registro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Atualizar usuário
	async update(req, res) {
		const { id, data } = req.body

		const existingUser = await userRepository.getById(id)

		if (!existingUser) {
			return res.status(404).json({
				success: false,
				error: 'ID não encontrado',
			})
		}

		try {
			const updateUser = await userRepository.update(id, data)

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: updateUser,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao atualizar registro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar registro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Deletar usuário
	async delete(req, res) {
		const { id } = req.body

		const existingUser = await userRepository.getById(id)

		if (!existingUser) {
			return res.status(404).json({
				success: false,
				error: 'ID não encontrado!',
			})
		}

		try {
			await userRepository.delete(id)
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro deletado com sucesso!',
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao deletar registro: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao deletar registro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
}

export default new UserController()
