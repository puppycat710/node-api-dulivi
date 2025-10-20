import complementGroupComplements from '../../repositories/store/complementGroupComplements.repository.js'

class complementGroupComplementsController {
	// Criar novo registro
	async upsert(req, res) {
		const { fk_complement_id, groups = [], fk_store_id } = req.body

		try {
			// apaga todos vínculos atuais desse contato nessa loja
			await complementGroupComplements.deleteByComplement(
				fk_complement_id,
				fk_store_id
			)

			// cria novos vínculos com os grupos enviados
			const inserted = []
			for (const group of groups) {
				const newContactGroup = await complementGroupComplements.upsert({
					fk_complement_id,
					fk_complement_group_id: group.fk_complement_group_id,
					fk_store_id,
				})
				inserted.push(newContactGroup)
			}
			// Retorno da API
			res.status(201).json({
				success: true,
				message: 'Registro criado com sucesso',
				data: inserted,
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
	// Criar novo registro
	async upsertGroupComplements(req, res) {
		const { fk_complement_group_id, complements = [], fk_store_id } = req.body

		try {
			// Apaga todos os vínculos atuais desse grupo nessa loja
			await complementGroupComplements.deleteByComplementGroup(fk_complement_group_id, fk_store_id)

			const inserted = []

			// Se tiver contatos selecionados, cria os novos vínculos
			for (const fk_complement_id of complements) {
				const newContactGroup = await complementGroupComplements.upsert({
					fk_complement_id,
					fk_complement_group_id,
					fk_store_id,
				})
				inserted.push(newContactGroup)
			}

			res.status(201).json({
				success: true,
				message: 'Vínculos atualizados com sucesso',
				data: inserted,
			})
		} catch (error) {
			console.error('Erro ao atualizar vínculos do grupo: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar vínculos',
				error:
					process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	// Buscar todos registros
	async getAll(req, res) {
		const fk_store_id = Number(req.query.fk_store_id)

		try {
			const contactGroups = await complementGroupComplements.getAll(
				fk_store_id
			)
			// Se não encontrou registro, retorna 404
			if (!contactGroups || contactGroups.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhum registro encontrado para esta loja',
				})
			}
			// Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registros encontradas com sucesso',
				data: contactGroups,
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
			const contactGroup = await complementGroupComplements.getById(id)
			// Se não encontrou registro, retorna 404
			if (!contactGroup || contactGroup.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhum registro encontrado para esta loja',
				})
			}
			// Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrada com sucesso',
				data: contactGroup,
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
		const existingComplementGroupComplements = await complementGroupComplements.getById(id)
		if (!existingComplementGroupComplements) {
			return res
				.status(404)
				.json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			const updateComplementGroupComplements = await complementGroupComplements.update(
				id,
				data
			)
			// Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: updateComplementGroupComplements,
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
		const existingComplementGroupComplements = await complementGroupComplements.getById(id)
		if (!existingComplementGroupComplements) {
			return res
				.status(404)
				.json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			await complementGroupComplements.delete(id)
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

export default new complementGroupComplementsController()
