import express from 'express'
import authToken from '../middlewares/authToken.js'
import cityController from '../controllers/store/city.controller.js'

const router = express.Router()

router.post('/api/city/create', authToken, validateNumericParam('fk_store_id'), cityController.create)
router.get('/api/city/all', validateNumericParam('fk_store_id'), cityController.getAll)
router.get('/api/city', validateNumericParam('id'), cityController.getById)
router.put('/api/city/update/:id', authToken, validateNumericParam('id'), cityController.update)
router.delete('/api/city/delete/:id', authToken, validateNumericParam('id'), cityController.delete)

export default router
