import express from 'express'
import authToken from '../middlewares/authToken.js'
import deliveryAreaController from '../controllers/store/deliveryArea.controller.js'

const router = express.Router()

router.post('/api/deliveryarea/create', authToken, deliveryAreaController.create)
router.get('/api/deliveryarea/all', deliveryAreaController.getAll)
router.get('/api/deliveryarea', deliveryAreaController.getById)
router.put('/api/deliveryarea/update/:id', authToken, deliveryAreaController.update)
router.delete('/api/deliveryarea/delete/:id', authToken, deliveryAreaController.delete)

export default router
