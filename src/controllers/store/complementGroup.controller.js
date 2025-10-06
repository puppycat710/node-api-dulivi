import complementGroupRepository from '../../repositories/store/complementGroup.repository.js'
import checkIfExists from '../../utils/checkIfExists.js'

class ComplementGroupController {
	// Cadastrar novo grupo de complementos
	async create(req, res) {
		const {
			title,
			option_limit = null,
			multiple_selection = null,
			allow_quantity_per_item = null,
			required = null,
			fk_store_id,
		} = req.body

		const complement_groups = () => complementGroupRepository.getAll(fk_store_id)

		const exists = await checkIfExists(complement_groups, 'title', title)

		if (exists) {
			return res
				.status(409)
				.json({ success: false, error: 'Registro com este título já existe.' })
		}

		try {
			const new_complement_group = await complementGroupRepository.create({
				title,
				option_limit,
				multiple_selection,
				allow_quantity_per_item,
				required,
				fk_store_id,
			})
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro criada com sucesso',
				data: new_complement_group,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar registro: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar registro' })
		}
	}
	// Buscar todos grupo de complementos
	async getAll(req, res) {
		const { fk_store_id } = req.body

		try {
			const complement_groups = await complementGroupRepository.getAll(fk_store_id)

			if (!complement_groups || complement_groups.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma registro encontrado para esta loja',
				})
			}

			res.status(200).json({
				success: true,
				message: 'Registros encontrados com sucesso',
				data: complement_groups,
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
	//Buscar grupo de complementos por ID
	async getById(req, res) {
		const { id } = req.body

		try {
			const complement_group = await complementGroupRepository.getById(id)

			if (!complement_group || complement_group.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma registro encontrado para esta loja',
				})
			}
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrado com sucesso',
				data: complement_group,
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
	//Atualizar grupo de complementos
	async update(req, res) {
		const { id, data } = req.body

		const existingComplementGroup = await complementGroupRepository.getById(id)

		if (!existingComplementGroup) {
			return res.status(404).json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			const updateComplementGroup = await complementGroupRepository.update(id, data)

			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: updateComplementGroup,
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
	// Deletar grupo de complementos
	async delete(req, res) {
		const { id } = req.body

		const existingComplementGroup = await complementGroupRepository.getById(id)

		if (!existingComplementGroup) {
			return res.status(404).json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			await complementGroupRepository.delete(id)
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
				message: 'Erro ao deletar registro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
}

export default new ComplementGroupController()
