import openingHourRepository from '../../repositories/store/openingHour.repository.js'

class OpeningHourController {
	// Salvar novo horário de funcionamento
	async upsert(req, res) {
		const { data, fk_store_id } = req.body

		try {
			await openingHourRepository.upsert(fk_store_id, data)

      const hours = await openingHourRepository.getById(fk_store_id)
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro criado com sucesso',
				data: hours,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar registro: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar registro' })
		}
	}
	// Buscar todos horário de funcionamento
	async getAll(req, res) {
		const { fk_store_id } = req.body

		try {
			const hours = await openingHourRepository.getAll(fk_store_id)

			if (!hours || hours.length === 0) {
				return res
					.status(404)
					.json({ success: false, message: 'Nenhum registro encontrado para esta loja.' })
			}
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrado com sucesso!',
				data: hours,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar registro: ', error)
			res.status(500).json({ success: false, error: 'Erro ao buscar registro' })
		}
	}
}

export default new OpeningHourController()
