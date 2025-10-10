export default function slugify(str) {
	return str
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')       // espaços → hífens
		.replace(/[^a-z0-9\-!]/g, '') // remove símbolos indesejados (ajuste conforme quiser permitir)
}
