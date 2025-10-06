import express from 'express'
import authToken from '../middlewares/authToken.js'
import contactController from '../controllers/message/contact.controller.js'

const router = express.Router()

router.post('/api/contact/create', authToken, contactController.create)
router.get('/api/contact/all', authToken, contactController.getAll)
router.get('/api/contact', authToken, contactController.getById)
router.put('/api/contact/update/:id', authToken, contactController.update)
router.delete('/api/contact/delete/:id', authToken, contactController.delete)

export default router
