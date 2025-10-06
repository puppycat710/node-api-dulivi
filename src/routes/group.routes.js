import express from 'express'
import authToken from '../middlewares/authToken.js'
import groupController from '../controllers/message/group.controller.js'

const router = express.Router()

router.post('/api/group/create', authToken, groupController.create)
router.get('/api/group/all', authToken, groupController.getAll)
router.get('/api/group', authToken, groupController.getById)
router.put('/api/group/update/:id', authToken, groupController.update)
router.delete('/api/group/delete/:id', authToken, groupController.delete)

export default router
