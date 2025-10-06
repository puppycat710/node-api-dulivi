import contactGroupRepository from '../../repositories/message/contactGroup.repository.js'

class contactGroupController {
	// Criar novo registro
	async upsert(req, res) {
		const { fk_contact_id, groups = [], fk_store_id } = req.body

		try {
			// apaga todos vínculos atuais desse contato nessa loja
			await contactGroupRepository.deleteByContact(
				fk_contact_id,
				fk_store_id
			)

			// cria novos vínculos com os grupos enviados
			const inserted = []
			for (const fk_group_id of groups) {
				const newContactGroup = await contactGroupRepository.upsert({
					fk_contact_id,
					fk_group_id,
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
	async upsertGroupContacts(req, res) {
		const { fk_group_id, contacts = [], fk_store_id } = req.body

		try {
			// Apaga todos os vínculos atuais desse grupo nessa loja
			await contactGroupRepository.deleteByGroup(fk_group_id, fk_store_id)

			const inserted = []

			// Se tiver contatos selecionados, cria os novos vínculos
			for (const fk_contact_id of contacts) {
				const newContactGroup = await contactGroupRepository.upsert({
					fk_contact_id,
					fk_group_id,
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
			const contactGroups = await contactGroupRepository.getAll(
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
			const contactGroup = await contactGroupRepository.getById(id)
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
		const existingContactGroup = await contactGroupRepository.getById(id)
		if (!existingContactGroup) {
			return res
				.status(404)
				.json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			const updateContactGroup = await contactGroupRepository.update(
				id,
				data
			)
			// Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro atualizado com sucesso',
				data: updateContactGroup,
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
		const existingContactGroup = await contactGroupRepository.getById(id)
		if (!existingContactGroup) {
			return res
				.status(404)
				.json({ success: false, error: 'Registro não encontrado' })
		}

		try {
			await contactGroupRepository.delete(id)
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

export default new contactGroupController()
