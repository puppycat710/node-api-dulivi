import express from 'express'
import authToken from '../middlewares/authToken.js'
import categoryController from '../controllers/store/category.controller.js'

const router = express.Router()

router.post('/api/category/create', authToken, categoryController.create)
router.get('/api/category/all', categoryController.getAll)
router.get('/api/category/', categoryController.getById)
router.put('/api/category/update/:id', authToken, categoryController.update)
router.delete('/api/category/delete/:id', authToken, categoryController.delete)

export default router
