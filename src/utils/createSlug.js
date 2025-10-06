/**
 * Converte um nome de restaurante em uma slug amigável para URLs.
 * Exemplo: "Nabih Esfiha's" => "nabihesfihas"
 *
 * @param {string} name - Nome original do restaurante
 * @returns {string} - Slug formatada
 */
export const createSlug = (name) => {
	return name
		.normalize('NFD') // Separa acentos das letras
		.replace(/[\u0300-\u036f]/g, '') // Remove os acentos
		.replace(/[^a-zA-Z0-9]/g, '') // Remove caracteres especiais e espaços
		.toLowerCase() // Converte para minúsculas
}
