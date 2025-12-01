import storeRepository from '../../repositories/store/store.repository.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { encrypt } from '../../lib/crypto.js'

const SECRET = process.env.JWT_SECRET

class StoreController {
	// Cadastrar nova loja
	async create(req, res) {
		const { name, email, password, phone = null, cpf = null } = req.body

		const hashedPassword = await bcrypt.hash(password, 10)

		try {
			const newStore = await storeRepository.create({
				name,
				email,
				password: hashedPassword,
			})
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro criado com sucesso',
				data: newStore,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar registro: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar registro' })
		}
	}
	//Login da loja
	async login(req, res) {
		const { email, password } = req.body
		try {
			const store = await storeRepository.getByEmail(email)

			if (!store) {
				return res.status(404).json({ success: false, error: 'Credenciais inválidas!' })
			}

			const passwordMatches = await bcrypt.compare(password.trim(), store.password)

			if (!passwordMatches) {
				return res.status(401).json({ success: false, error: 'Credenciais inválidas' })
			}

			const token = jwt.sign({ id: store.id, email: store.email }, SECRET, {
				expiresIn: '30d',
			})
			//Retorno da API
			res.status(200).json({
				success: true,
				data: {
					id: store.id,
					token,
				},
				message: 'Login verificado com sucesso',
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao verificar login: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao verificar login',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Buscar por ID
	async getById(req, res) {
		const id = req.params.id

		try {
			const store = await storeRepository.getById(id)

			if (!store || store.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'ID não encontrado',
				})
			}
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrado com sucesso!',
				data: store,
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
	//Buscar por slug
	async getBySlug(req, res) {
		const slug = req.params.slug

		try {
			const store = await storeRepository.getBySlug(slug)

			if (!store || store.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Slug não encontrado',
				})
			}
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrado com sucesso!',
				data: store,
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
	// Atualizar loja
	async update(req, res) {
		const id = req.params.id
		const { data } = req.body

		const existingStore = await storeRepository.getById(id)

		if (!existingStore) {
			return res.status(404).json({ success: false, error: 'ID não encontrado' })
		}

		try {
			// Se tiver access_token, criptografa antes de atualizar
			if (data.mercadopago_access_token) {
				data.mercadopago_access_token = encrypt(data.mercadopago_access_token)
			}

			if (data.password) {
				data.password = await bcrypt.hash(data.password, 10)
			}

			const updateStore = await storeRepository.update(id, data)

			// Remove dados sensíveis antes de enviar ao cliente
			delete updateStore?.password
			delete updateStore?.mercadopago_access_token

			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: updateStore,
			})
		} catch (error) {
			console.error('Erro ao atualizar registro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar registro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
}

export default new StoreController()
