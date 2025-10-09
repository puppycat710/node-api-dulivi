import { api } from '../lib/whatsapp.js'
import contactGroupRepository from '../repositories/message/contactGroup.repository.js'
import messageRepository from '../repositories/message/message.repository.js'
import logMessage from './logMessage.js'

export default async function sendMessageToGroup(msg) {
	console.log('>>>>>>>>>1')
	const contacts = await contactGroupRepository.getContactsByGroupId(msg.fk_group_id)
	console.log(contacts.message)
	for (const contact of contacts) {
		try {
			console.log('>>>>>>>>>2')
			const res = await api.post('/send', {
				number: contact.contact,
				message: msg.text,
			})
			console.log('>>>>>>>>>3')
			logMessage(msg, contact)
			console.log(res.message)
		} catch (err) {
			console.warn(`⚠️ Erro ao enviar para ${contact.contact}:`, err.message)
		}
	}

	if (msg.frequency === 'once') {
		await messageRepository.delete(msg.id)
	}
}
