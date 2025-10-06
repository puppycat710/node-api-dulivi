import productRepository from '../repositories/store/product.repository.js'

export default async function validateProductPrice(id) {
	const product = await productRepository.getById(id)
	if (!product) {
		return null
	}

	return product.price
}
