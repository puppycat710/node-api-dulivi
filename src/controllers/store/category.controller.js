import categoryRepository from '../../repositories/store/category.repository.js'
import checkIfExists from '../../utils/checkIfExists.js'

class CategoryController {
	// Cadastrar nova categoria
	async create(req, res) {
		const { title, image, fk_store_id } = req.body

		const categories = () => categoryRepository.getAll(fk_store_id)

		const exists = await checkIfExists(categories, 'title', title)

		if (exists) {
			return res.status(409).json({ success: false, error: 'Categoria com este título já existe.' })
		}

		try {
			const newCategory = await categoryRepository.create({
				title,
				image,
				fk_store_id,
			})
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Categoria criada com sucesso',
				data: newCategory,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao criar categoria: ', error)
			res.status(500).json({ success: false, error: 'Erro ao criar categoria' })
		}
	}
	// Buscar todas categoria
	async getAll(req, res) {
		const fk_store_id = Number(req.query.fk_store_id)

		try {
			const categories = await categoryRepository.getAll(fk_store_id)

			if (!categories || categories.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma categoria encontrada para esta loja',
				})
			}

			res.status(200).json({
				success: true,
				message: 'Produtos encontrados com sucesso',
				data: categories,
			})
		} catch (error) {
			console.error('Erro ao buscar categorias:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar categorias',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Buscar categoria por ID
	async getById(req, res) {
		const id = Number(req.query.id)

		try {
			const category = await categoryRepository.getById(id)

			if (!category || category.length === 0) {
				return res.status(404).json({
					success: false,
					error: 'Nenhuma categoria encontrada para esta loja',
				})
			}

			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Categoria encontrada com sucesso',
				data: category,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao buscar categoria:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao buscar categoria',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	//Atualizar categoria
	async update(req, res) {
		const id = Number(req.params.id)
		const { data } = req.body

		const existingCategory = await categoryRepository.getById(id)

		if (!existingCategory) {
			return res.status(404).json({ success: false, error: 'Categoria não encontrado' })
		}

		try {
			const updateCategory = await categoryRepository.update(id, data)

			res.status(200).json({
				success: true,
				message: 'Categoria atualizado com sucesso',
				data: updateCategory,
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao atualizar categoria:', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar categoria',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
	// Deletar categoria
	async delete(req, res) {
		const id = Number(req.params.id)

		const existingCategory = await categoryRepository.getById(id)

		if (!existingCategory) {
			return res.status(404).json({ success: false, error: 'Categoria não encontrada' })
		}

		try {
			await categoryRepository.delete(id)
			//Retorno da API
			res.status(200).json({
				success: true,
				message: 'Categoria deletada com sucesso',
			})
			//Tratamento de erros
		} catch (error) {
			console.error('Erro ao deletar categoria: ', error)
			res.status(500).json({
				success: false,
				message: 'Erro ao atualizar categoria',
				error: process.env.NODE_ENV === 'development' ? error : undefined,
			})
		}
	}
}

export default new CategoryController()
