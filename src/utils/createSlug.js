/**
 * Converte um nome de restaurante em uma slug amigável para URLs.
 * Exemplo: "Nabih Esfiha's" => "nabih-esfihas"
 *
 * @param {string} name - Nome original do restaurante
 * @returns {string} - Slug formatada
 */
export const createSlug = (name) => {
	return name
		.normalize('NFD') // Separa acentos das letras
		.replace(/[\u0300-\u036f]/g, '') // Remove acentos
		.replace(/[^a-zA-Z0-9\s]/g, '') // Remove caracteres especiais, mas mantém espaços
		.trim() // Remove espaços extras no início e no fim
		.replace(/\s+/g, '-') // Substitui espaços por hífens
		.toLowerCase() // Converte para minúsculas
}
