function getTimestamp() {
  const now = new Date()
  const yyyy = now.getFullYear()
  const MM = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const HH = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`
}

function maskNumber(number) {
  // Exemplo: 5511998765432 -> 55119*****432
  return number.replace(/(\d{5})\d+(\d{3})/, '$1*****$2')
}

export default function logMessage(msg, contact) {
  console.log(
    `✅ [INFO] [${getTimestamp()}] Disparo concluído | msgId=${msg.id} | contato=${maskNumber(contact.contact)} | grupo=${msg.fk_group_id}`
  )
}
