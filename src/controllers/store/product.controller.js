import productRepository from '../../repositories/store/product.repository.js'
import checkIfExists from '../../utils/checkIfExists.js'

class ProductController {
	//Cadastrar novo produto
	async create(req, res) {
		const {
			title,
			description,
			price,
			servings = null,
			weight_grams = null,
			image = '/assets/image.png',
			fk_store_categories_id,
			fk_store_id,
		} = req.body
		// Verificando se existe registro com mesmo nome nessa loja
		const products = () => productRepository.getAll(fk_store_id)
		const exists = await checkIfExists(products, 'title', title)
		if (exists) {
			return res
				.status(409)
				.json({ success: false, error: 'Registro com este título já existe.' })
		}

		try {
			const newProduct = await productRepository.create({
				title,
				description,
				price,
				image,
				servings,
				weight_grams,
				fk_store_categories_id,
				fk_store_id,
			})
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Produto criado com sucesso',
				data: newProduct,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar produto: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar produto' })
		}
	}
	//Buscar produtos
	async getAll(req, res) {
		const fk_store_id = Number(req.query.fk_store_id)

		try {
			const products = await productRepository.getAll(fk_store_id)

			if (!products || products.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma produto encontrado para esta loja',
				})
			}

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Produtos encontrados com sucesso',
				data: products,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar produtos:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar produtos',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Buscar produto por ID
	async getById(req, res) {
		const id = Number(req.params.id)

		try {
			const product = await productRepository.getById(id)

			if (!product || product.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhum produto encontrado para esta loja',
				})
			}

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'produto encontrado com sucesso',
				data: product,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar produto:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar produto',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Buscar por slug
	async getBySlug(req, res) {
		const slug = req.params.slug

		try {
			const product = await productRepository.getBySlug(slug)

			if (!product || product.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Slug não encontrado',
				})
			}
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Registro encontrado com sucesso!',
				data: product,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar registro:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar registro',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Atualizar produto
	async update(req, res) {
		const id = req.params.id
		const { data } = req.body
		// Verificando se existe registro com mesmo nome nessa loja
		const current_product = await productRepository.getById(id)
		const products = await productRepository.getAll(current_product.fk_store_id)
		const exists = await checkIfExists(products, 'title', data.title)
		if (exists) {
			return res
				.status(409)
				.json({ success: false, error: 'Registro com este título já existe.' })
		}

		try {
			const updateProduct = await productRepository.update(id, data)

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Produto atualizado com sucesso',
				data: updateProduct,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao atualizar produto:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar produto',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Deletar produto
	async delete(req, res) {
		const id = Number(req.params.id)

		const existingProduct = await productRepository.getById(id)

		if (!existingProduct) {
			return res.status(404).json({ success: false, error: 'Produto não encontrada' })
		}

		try {
			await productRepository.delete(id)
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Produto deletado com sucesso',
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao deletar produto: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao deletar produto',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
}

export default new ProductController()
