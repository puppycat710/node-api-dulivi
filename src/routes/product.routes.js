import express from 'express'
import authToken from '../middlewares/authToken.js'
import productController from '../controllers/store/product.controller.js'

const router = express.Router()

router.post('/api/product/create', authToken, productController.create)
router.get('/api/product/all/', productController.getAll)
router.get('/api/product/:id', productController.getById)
router.put('/api/product/update/:id', authToken, productController.update)
router.delete('/api/product/delete/:id', authToken, productController.delete)

export default router
