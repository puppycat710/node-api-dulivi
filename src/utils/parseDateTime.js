export default function parseDateTime(str) {
	const [datePart, timePart] = str.split(' ')
	const [year, month, day] = datePart.split('-').map(Number)
	const [hours, minutes, seconds] = timePart.split(':').map(Number)
	// O horário no banco é de Brasília (UTC-3)
	// Então adicionamos +3h para converter para UTC (servidor)
	const utcTime = Date.UTC(year, month - 1, day, hours - 1, minutes, seconds)

	return new Date(utcTime)
}
