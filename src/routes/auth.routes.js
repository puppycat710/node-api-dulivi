import express from 'express'
import sessionController from '../controllers/user/session.controller.js'

const router = express.Router()

router.post('/api/session/create', sessionController.create)
router.get('/api/session/:id', sessionController.getById)
router.put('/api/session/update/:id', sessionController.update)
router.post('/api/session/finish/:id', sessionController.finish)

export default router
