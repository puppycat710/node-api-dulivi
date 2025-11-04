import express from 'express'
import authToken from '../middlewares/authToken.js'
import complementGroupProductsController from '../controllers/store/complementGroupProducts.controller.js'

const router = express.Router()

router.post('/api/complement-group-products/upsert', authToken, complementGroupProductsController.upsert)
router.post('/api/complement-group-products/bulk-upsert', authToken, complementGroupProductsController.upsertGroupProducts)
router.get('/api/complement-group-products/all', complementGroupProductsController.getAll)
router.get('/api/complement-group-products/', complementGroupProductsController.getById)
router.put('/api/complement-group-products/update/:id', authToken, complementGroupProductsController.update)
router.delete('/api/complement-group-products/delete/:id', authToken, complementGroupProductsController.delete)

export default router
