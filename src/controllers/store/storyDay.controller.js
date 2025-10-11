import storeDaysRepository from '../../repositories/store/storeDays.repository.js'

class StoryDayController {
	// Criar novo registro
	async create(req, res) {
		const { weekday, is_open, fk_store_id } = req.body

		try {
			const newStoreDay = await storeDaysRepository.create({
				weekday,
				is_open,
				fk_store_id,
			})
			// Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro criado com sucesso',
				data: newStoreDay,
			})
			// Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar registro: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao criar registro',
				error:
					process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	// Buscar registros
	async getAll(req, res) {
		const fk_store_id = Number(req.query.fk_store_id)

		try {
			const storeDays = await storeDaysRepository.getAll(fk_store_id)
			// Se não encontrou registro, retorna 404
			if (!storeDays || storeDays.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhum registro encontrado para esta loja',
				})
			}
			// Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registros encontradas com sucesso',
				data: storeDays,
			})
			// Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar registros:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar registros',
				error:
					process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	// Buscar por ID
	async getById(req, res) {
		const id = Number(req.query.id)

		try {
			const storeDay = await storeDaysRepository.getById(id)
			// Se não encontrou registro, retorna 404
			if (!storeDay || storeDay.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhum registro encontrado para esta loja',
				})
			}
			// Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrada com sucesso',
				data: storeDay,
			})
			// Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar registro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar registro',
				error:
					process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	// Atualizar registro
	async update(req, res) {
		const id = Number(req.params.id)
		const { data } = req.body
		// Verifica se o registro existe
		const existingStoreDay = await storeDaysRepository.getById(id)
		if (!existingStoreDay) {
			return res
				.status(404)
				.json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			const updateStoreDay = await storeDaysRepository.update(id, data)
			// Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: updateStoreDay,
			})
			// Tratamento de erros
		} catch (error) {
			console.error('Erro ao atualizar registro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar registro',
				error:
					process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	// Deletar registro
	async delete(req, res) {
		const id = Number(req.params.id)
		// Verifica se o registro existe
		const existingStoreDay = await storeDaysRepository.getById(id)
		if (!existingStoreDay) {
			return res
				.status(404)
				.json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			await storeDaysRepository.delete(id)
			// Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro deletado com sucesso',
			})
			// Tratamento de erros
		} catch (error) {
			console.error('Erro ao deletar registro: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao deletar registro',
				error:
					process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
}

export default new StoryDayController()
