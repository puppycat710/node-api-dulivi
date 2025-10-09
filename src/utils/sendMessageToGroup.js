import { api } from '../lib/whatsapp.js'
import contactGroupRepository from '../repositories/message/contactGroup.repository.js'
import messageRepository from '../repositories/message/message.repository.js'
import logMessage from './logMessage.js'

export default async function sendMessageToGroup(msg) {
	const contacts = await contactGroupRepository.getContactsByGroupId(msg.fk_group_id)

	for (const contact of contacts) {
		try {
			const res = await api.post('/send', {
				number: contact.contact,
				message: msg.text,
			})
			logMessage(msg, contact)
			console.log(res)
		} catch (err) {
			console.warn(`⚠️ Erro ao enviar para ${contact.contact}:`, err.message)
		}
	}

	if (msg.frequency === 'once') {
		await messageRepository.delete(msg.id)
	}
}
