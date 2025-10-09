// import cron from 'node-cron'
import messageRepository from '../repositories/message/message.repository.js'
import parseDateTime from '../utils/parseDateTime.js'
import sendMessageToGroup from '../utils/sendMessageToGroup.js'
import isTimeToSend from '../utils/isTimeToSend.js'

export default async function processScheduledMessages() {
	try {
		const messages = await messageRepository.getScheduledMessages()
		if (!messages || messages.length === 0) return

		const now = new Date()
		const currentDay = now.getDay() // 0 = domingo, 6 = sábado

		for (const msg of messages) {
			const scheduledDate = parseDateTime(msg.send_at)
			const frequency = msg.frequency
			console.log('>>>AGENDADO: ', scheduledDate, '>>>SERVIDOR: ', now)
			if (frequency === 'weekdays' && (currentDay === 0 || currentDay === 6)) continue
			
			if (isTimeToSend(scheduledDate, now)) {
				console.log('VAI DISPARAAAAAAAR')
				await sendMessageToGroup(msg)
			}
		}
	} catch (error) {
		console.error('❌ Erro ao processar disparos:', error)
	}
}
// Executa a cada minuto
// cron.schedule('* * * * *', processScheduledMessages)
