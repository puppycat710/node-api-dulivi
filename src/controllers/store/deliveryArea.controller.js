import deliveryAreaRepository from '../../repositories/store/deliveryArea.repository.js'
import checkIfExists from '../../utils/checkIfExists.js'

class DeliveryAreaController {
	// Cadastrar nova area de entrega
	async create(req, res) {
		const {
			name,
			delivery_fee,
			delivery_time_min,
			delivery_time_max,
			fk_store_cities_id,
			fk_store_id
		} = req.body

		const deliveryAreas = () => deliveryAreaRepository.getAll(fk_store_id)

		const exists = await checkIfExists(deliveryAreas, 'name', name)

		if (exists) {
			return res
				.status(409)
				.json({ success: false, error: 'Bairro com este título já existe.' })
		}

		try {
			const newDeliveryArea = await deliveryAreaRepository.create({
				name,
				delivery_fee,
				delivery_time_min,
				delivery_time_max,
				fk_store_cities_id,
				fk_store_id
			})
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Bairro cadastrado com sucesso',
				data: newDeliveryArea,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar bairro: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar bairro' })
		}
	}
	// Buscar todas areas de entrega
	async getAll(req, res) {
		const fk_store_id = Number(req.query.fk_store_id)

		try {
			const deliveryAreas = await deliveryAreaRepository.getAll(fk_store_id)

			if (!deliveryAreas || deliveryAreas.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhum bairro encontrado para esta loja',
				})
			}
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Bairro encontrados com sucesso',
				data: deliveryAreas,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar bairro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar bairro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Buscar bairro por ID
	async getById(req, res) {
		const id = Number(req.query.id)

		try {
			const deliveryArea = await deliveryAreaRepository.getById(id)

			if (!deliveryArea || deliveryArea.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhum bairro encontrado para esta loja',
				})
			}

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Bairro encontrada com sucesso',
				data: deliveryArea,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar bairro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar bairro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Atualizar bairro
	async update(req, res) {
		const id = Number(req.params.id)
		const { data } = req.body

		const existingDeliveryArea = await deliveryAreaRepository.getById(id)

		if (!existingDeliveryArea) {
			return res.status(404).json({ success: false, error: 'Bairro não encontrado' })
		}

		try {
			const updateDeliveryArea = await deliveryAreaRepository.update(id, data)

			res.status(200).json({
				success: true,
				message: 'Bairro atualizado com sucesso',
				data: updateDeliveryArea,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao atualizar bairro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar bairro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	// Deletar area de entrega
	async delete(req, res) {
		const id = Number(req.params.id)

		const existingDeliveryArea = await deliveryAreaRepository.getById(id)

		if (!existingDeliveryArea) {
			return res.status(404).json({ success: false, error: 'Bairro não encontrado' })
		}

		try {
			await deliveryAreaRepository.delete(id)
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Bairro deletado com sucesso',
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao deletar bairro: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar bairro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
}

export default new DeliveryAreaController()
