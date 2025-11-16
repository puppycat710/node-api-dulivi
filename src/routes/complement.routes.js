import express from 'express'
import authToken from '../middlewares/authToken.js'
import complementController from '../controllers/store/complement.controller.js'

const router = express.Router()

router.post('/api/complement/create', authToken, complementController.create)
router.get('/api/complement/all', complementController.getAll)
router.get('/api/store/:store_id/product/:product_id/complements', complementController.getGroups)
router.get('/api/complement/', complementController.getById)
router.put('/api/complement/update/:id', authToken, complementController.update)
router.delete('/api/complement/delete/:id', authToken, complementController.delete)

export default router
