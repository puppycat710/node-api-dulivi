export default function isTimeToSend(scheduledDate, now) {
	return scheduledDate.getHours() === now.getHours() && scheduledDate.getMinutes() === now.getMinutes()
}
