import complementRepository from '../repositories/store/complement.repository.js'

export default async function validateComplementPrice(id) {
	const complement = await complementRepository.getById(id)
	if (!complement) {
		return null
	}

	return complement.price
}
