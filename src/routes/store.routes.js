import express from 'express'
import storeController from '../controllers/store/store.controller.js'
import authToken from '../middlewares/authToken.js'

const router = express.Router()

router.post('/api/store/create', storeController.create)
router.post('/api/store/login', storeController.login)
router.get('/api/store/:id', storeController.getById)
router.get('/api/store/:slug', storeController.getBySlug)
router.put('/api/store/update/:id', authToken, storeController.update)

export default router
