import complementRepository from '../../repositories/store/complement.repository.js'
import checkIfExists from '../../utils/checkIfExists.js'

class ComplementController {
	// Cadastrar novo complemento
	async create(req, res) {
		const { title, description, price, max_quantity, image, fk_complement_group_id, fk_store_id } = req.body

		const complements = () => complementRepository.getAll(fk_complement_group_id)

		const exists = await checkIfExists(complements, 'title', title)

		if (exists) {
			return res
				.status(409)
				.json({ success: false, error: 'Registro com este título já existe.' })
		}

		try {
			const newComplement = await complementRepository.create({
				title,
				description,
				price,
				max_quantity,
				image,
				fk_complement_group_id,
				fk_store_id
			})
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro criada com sucesso',
				data: newComplement,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar registro: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar registro' })
		}
	}
	// Buscar todos complemento
	async getAll(req, res) {
		const { fk_store_id } = req.body

		try {
			const complements = await complementRepository.getAll(fk_store_id)

			if (!complements || complements.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma registro encontrado para esta loja',
				})
			}

			res.status(200).json({
				success: true,
				message: 'Registros encontrados com sucesso',
				data: complements,
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
	//Buscar complemento por ID
	async getById(req, res) {
		const { id } = req.body

		try {
			const complement = await complementRepository.getById(id)

			if (!complement || complement.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma registro encontrado para esta loja',
				})
			}

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrado com sucesso',
				data: complement,
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
	//Atualizar complemento
	async update(req, res) {
		const { id, data } = req.body

		const existingComplement = await complementRepository.getById(id)

		if (!existingComplement) {
			return res.status(404).json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			const updateComplement = await complementRepository.update(id, data)

			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: updateComplement,
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
	// Deletar complemento
	async delete(req, res) {
		const { id } = req.body

		const existingComplement = await complementRepository.getById(id)

		if (!existingComplement) {
			return res.status(404).json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			await complementRepository.delete(id)
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

export default new ComplementController()
