// import cron from 'node-cron'
import messageRepository from '../repositories/message/message.repository.js'
import parseDateTime from '../utils/parseDateTime.js'
import sendMessageToGroup from '../utils/sendMessageToGroup.js'
import isTimeToSend from '../utils/isTimeToSend.js'

export default async function processScheduledMessages() {
	try {
		console.log('🚀 Iniciando verificação de mensagens agendadas...')
		const messages = await messageRepository.getScheduledMessages()
		console.log(`📦 Mensagens encontradas: ${messages?.length || 0}`)
		if (!messages || messages.length === 0) return

		const now = new Date()
		const currentDay = now.getDay() // 0 = domingo, 6 = sábado
		console.log(`🕐 Horário atual do servidor: ${now.toISOString()} (Day: ${currentDay})`)
		for (const msg of messages) {
			const scheduledDate = parseDateTime(msg.send_at)
			const frequency = msg.frequency
			console.log('\n📨 --- Nova mensagem ---')
			console.log('🆔 ID:', msg.id)
			console.log('🧩 Frequência:', frequency)
			console.log('🕓 Agendado para:', scheduledDate.toISOString())
			console.log('💬 Conteúdo:', msg.text)
			if (frequency === 'weekdays' && (currentDay === 0 || currentDay === 6)) continue

			const ready = isTimeToSend(scheduledDate, now)
			console.log('⏱️ Está na hora de enviar?', ready ? '✅ SIM' : '❌ NÃO')
			if (ready) {
				console.log('🚀 Enviando mensagem agendada...')
				await sendMessageToGroup(msg)
			}
		}
	} catch (error) {
		console.error('❌ Erro ao processar disparos:', error)
	}
}
// Executa a cada minuto
// cron.schedule('* * * * *', processScheduledMessages)
