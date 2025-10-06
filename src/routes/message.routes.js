import express from 'express'
import authToken from '../middlewares/authToken.js'
import messageController from '../controllers/message/message.controller.js'

const router = express.Router()

router.post('/api/message/create', authToken, messageController.create)
router.get('/api/message/all', authToken, messageController.getActiveMessages)
router.get('/api/message', authToken, messageController.getById)
router.put('/api/message/update/:id', authToken, messageController.update)
router.delete('/api/message/delete/:id', authToken, messageController.delete)

export default router
