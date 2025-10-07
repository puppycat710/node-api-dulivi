import { api } from '../lib/whatsapp.js'
import contactGroupRepository from '../repositories/message/contactGroup.repository.js'
import messageRepository from '../repositories/message/message.repository.js'
import logMessage from './logMessage.js'

export default async function sendMessageToGroup(msg) {
	try {
		console.log(`📨 Buscando contatos do grupo ID: ${msg.fk_group_id}`)
		const contacts = await contactGroupRepository.getContactsByGroupId(msg.fk_group_id)
		console.log(`👥 Contatos encontrados: ${contacts?.length || 0}`)

		if (!contacts || contacts.length === 0) {
			console.log('⚠️ Nenhum contato encontrado nesse grupo, pulando envio.')
			return
		}

		for (const contact of contacts) {
			try {
				console.log(`📤 Enviando para ${contact.contact}...`)
				await api.post('/send', {
					number: contact.contact,
					message: msg.text,
				})
				logMessage(msg, contact)
				console.log(`✅ Enviado para ${contact.contact}`)
			} catch (err) {
				console.warn(`⚠️ Erro ao enviar para ${contact.contact}:`, err.message)
			}
		}

		if (msg.frequency === 'once') {
			console.log(`🧹 Mensagem ID ${msg.id} enviada uma vez — deletando registro...`)
			await messageRepository.delete(msg.id)
		}

		console.log('🏁 Envio concluído para todos os contatos do grupo.\n')
	} catch (err) {
		console.error('❌ Erro em sendMessageToGroup:', err)
	}
}
