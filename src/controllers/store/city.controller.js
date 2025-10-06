import cityRepository from '../../repositories/store/city.repository.js'
import checkIfExists from '../../utils/checkIfExists.js'

class CityController {
	// Cadastrar nova cidade
	async create(req, res) {
		const { name, fk_store_id } = req.body

		const cities = () => cityRepository.getAll(fk_store_id)

		const exists = await checkIfExists(cities, 'name', name)

		if (exists) {
			return res
				.status(409)
				.json({ success: false, error: 'Cidade com este nome já existe.' })
		}

		try {
			const newCity = await cityRepository.create({
				name,
				fk_store_id,
			})
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'cidade criada com sucesso',
				data: newCity,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar cidade: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar cidade' })
		}
	}
	// Buscar cidade
	async getAll(req, res) {
		const fk_store_id = Number(req.query.fk_store_id)

		try {
			const cities = await cityRepository.getAll(fk_store_id)

			if (!cities || cities.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma cidade encontrada para esta loja',
				})
			}

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'cidades encontradas com sucesso',
				data: cities,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar cidades:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar cidades',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Buscar produto por ID
	async getById(req, res) {
		const id = Number(req.query.id)

		try {
			const city = await cityRepository.getById(id)

			if (!city || city.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhum cidade encontrada para esta loja',
				})
			}

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'cidade encontrada com sucesso',
				data: city,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar cidade:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar cidade',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Atualizar cidade
	async update(req, res) {
		const id = Number(req.params.id)
		const { data } = req.body

		const existingCity = await cityRepository.getById(id)

		if (!existingCity) {
			return res.status(404).json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			const updateCity = await cityRepository.update(id, data)

			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: updateCity,
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
	// Deletar cidade
	async delete(req, res) {
		const id = Number(req.params.id)

		const existingCity = await cityRepository.getById(id)

		if (!existingCity) {
			return res.status(404).json({ success: false, error: 'Cidade não encontrada' })
		}

		try {
			await cityRepository.delete(id)
			res.status(200).json({
				success: true,
				message: 'Produto deletado com sucesso',
			})
		} catch (error) {
			console.error('Erro ao deletar cidade: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao deletar cidade',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
}

export default new CityController()
