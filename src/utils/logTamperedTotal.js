export default function logTamperedTotal(original, corrected, context = '') {
  console.warn(`⚠️ Valor do pedido ajustado ${context ? `[${context}]` : ''} | Enviado: ${original}, Corrigido: ${corrected}`)
}