import cityRepository from '../../repositories/store/city.repository.js'
import { cityCreateSchema, cityUpdateSchema, fkStoreIdSchema } from '../../schemas/city.schema.js'
import checkIfExists from '../../utils/checkIfExists.js'

class CityController {
	// Cadastrar nova cidade
	async create(req, res) {
		// parse + validação com Zod
		let data
		try {
			data = cityCreateSchema.parse({
				name: req.body.name,
				fk_store_id: Number(req.query.fk_store_id),
			})
		} catch (err) {
			return res.status(400).json({ success: false, error: err.errors })
		}
		// verifica se já existe
		const exists = await checkIfExists(() => cityRepository.getAll(data.fk_store_id), 'name', data.name)
		if (exists) return res.status(409).json({ success: false, error: 'Cidade com este nome já existe.' })

		try {
			const newCity = await cityRepository.create(data)
			res.status(200).json({
				success: true,
				message: 'Cidade criada com sucesso',
				data: newCity,
			})
		} catch (error) {
			console.error('Erro ao criar cidade: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar cidade' })
		}
	}
	// Buscar cidade
	async getAll(req, res) {
		// validação com Zod usando safeParse
		const result = fkStoreIdSchema.safeParse(req.query)
		if (!result.success) {
			return res.status(400).json({ success: false, error: result.error.errors })
		}
		const { fk_store_id } = result.data
		// Buscar cidade
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
	//Buscar cidade por ID
	async getById(req, res) {
		//parse + validação com Zod
		let data
		try {
			data = idParamSchema.parse(req.params)
		} catch (err) {
			return res.status(400).json({ success: false, error: err.errors })
		}
		// Buscar cidade por ID
		try {
			const city = await cityRepository.getById(data.id)
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
		// validar id
		let params
		try {
			params = idParamSchema.parse(req.params)
		} catch (err) {
			return res.status(400).json({ success: false, error: err.errors })
		}
		// validar body
		let body
		try {
			body = cityUpdateSchema.parse(req.body)
		} catch (err) {
			return res.status(400).json({ success: false, error: err.errors })
		}
		// Verificar se a cidade existe
		const existingCity = await cityRepository.getById(params.id)
		if (!existingCity) {
			return res.status(404).json({ success: false, error: 'Registro não encontrado' })
		}
		// Atualizar a cidade
		try {
			const updateCity = await cityRepository.update(params.id, body)
			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: updateCity,
			})
		} catch (error) {
			console.error('Erro ao atualizar registro:', error)
			res.status(500).json({ success: false, message: 'Erro ao atualizar registro' })
		}
	}
	// Deletar cidade
	async delete(req, res) {
		//parse + validação com Zod
		let data
		try {
			data = idParamSchema.parse(req.params)
		} catch (err) {
			return res.status(400).json({ success: false, error: err.errors })
		}
		// Verificar se a cidade existe
		const existingCity = await cityRepository.getById(data.id)
		if (!existingCity) {
			return res.status(404).json({ success: false, error: 'Cidade não encontrada' })
		}
		// Deletar a cidade
		try {
			await cityRepository.delete(data.id)
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
