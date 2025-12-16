import express from 'express'
import authToken from '../middlewares/authToken.js'
import cityController from '../controllers/store/city.controller.js'

const router = express.Router()

router.post('/api/city/create', authToken, cityController.create)
router.get('/api/city/all', cityController.getAll)
router.get('/api/city/:id', cityController.getById)
router.put('/api/city/update/:id', authToken, cityController.update)
router.delete('/api/city/delete/:id', authToken, cityController.delete)

export default router
