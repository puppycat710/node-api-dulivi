import express from 'express'
import authToken from '../middlewares/authToken.js'
import complementGroupController from '../controllers/store/complementGroup.controller.js'

const router = express.Router()

router.post('/api/complement-group/create', authToken, complementGroupController.create)
router.get('/api/complement-group/all', complementGroupController.getAll)
router.get('/api/complement-group/', complementGroupController.getById)
router.put('/api/complement-group/update/:id', authToken, complementGroupController.update)
router.delete('/api/complement-group/delete/:id', authToken, complementGroupController.delete)

export default router
