/**
 * Tenta converter o valor para um ID válido (inteiro positivo).
 * Retorna o número convertido ou null se inválido.
 * @param {any} value
 * @returns {number|null}
 */
export default function parseValidId(value) {
	const id = Number(value)
	// trata "" como inválido
	if (typeof value === 'string' && value.trim() === '') return null

	return Number.isInteger(id) && id > 0 ? id : null
}
