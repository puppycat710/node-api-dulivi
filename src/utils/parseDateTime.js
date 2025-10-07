export default function parseDateTime(str) {
	const [datePart, timePart] = str.split(' ')
	const [year, month, day] = datePart.split('-').map(Number)
	const [hours, minutes, seconds] = timePart.split(':').map(Number)

	// Cria data local (sem UTC)
	return new Date(year, month - 1, day, hours, minutes, seconds)
}
