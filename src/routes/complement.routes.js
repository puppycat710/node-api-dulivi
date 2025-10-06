import express from 'express'
import authToken from '../middlewares/authToken.js'
import complementController from '../controllers/store/complement.controller.js'

const router = express.Router()

router.post('/api/complement/create', complementController.create)
router.get('/api/complement/all', complementController.getAll)
router.get('/api/complement/id', complementController.getById)
router.put('/api/complement/update', complementController.update)
router.delete('/api/complement/delete', complementController.delete)

export default router
