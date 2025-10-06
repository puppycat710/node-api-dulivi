import storeCashbackRepository from '../../repositories/store/storeCashback.repository.js'
import checkIfExists from '../../utils/checkIfExists.js'

class StoreCashbackController {
	// Cadastrar
	async create(req, res) {
		const { is_active, percentage, minimum_order_value, fk_store_id } = req.body

		const store_cashback = () => storeCashbackRepository.getAll(fk_store_id)

		const exists = await checkIfExists(store_cashback, 'title', title)

		if (exists) {
			return res
				.status(409)
				.json({ success: false, error: 'Registro com este título já existe.' })
		}

		try {
			const new_store_cashback = await storeCashbackRepository.create({
				is_active,
				percentage,
				minimum_order_value,
				fk_store_id
			})
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro criado com sucesso',
				data: new_store_cashback,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar registro: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar registro' })
		}
	}
	// Buscar todos
	async getAll(req, res) {
		const { fk_store_id } = req.body

		try {
			const store_cashback = await storeCashbackRepository.getAll(fk_store_id)

			if (!store_cashback || store_cashback.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma registro encontrado para esta loja',
				})
			}

			res.status(200).json({
				success: true,
				message: 'Registros encontrados com sucesso',
				data: store_cashback,
			})
		} catch (error) {
			console.error('Erro ao buscar registros:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar registros',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Buscar por ID
	async getById(req, res) {
		const { id } = req.body

		try {
			const store_cashback = await storeCashbackRepository.getById(id)

			if (!store_cashback || store_cashback.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma registro encontrado para esta loja',
				})
			}

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrado com sucesso',
				data: store_cashback,
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
	//Atualizar
	async update(req, res) {
		const { id, data } = req.body

		const existing_store_cashback = await storeCashbackRepository.getById(id)

		if (!existing_store_cashback) {
			return res.status(404).json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			const update_store_cashback = await storeCashbackRepository.update(id, data)

			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: update_store_cashback,
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
	// Deletar
	async delete(req, res) {
		const { id } = req.body

		const existing_store_cashback = await storeCashbackRepository.getById(id)

		if (!existing_store_cashback) {
			return res.status(404).json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			await storeCashbackRepository.delete(id)
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro deletado com sucesso',
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao deletar registro: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar registro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
}

export default new StoreCashbackController()
