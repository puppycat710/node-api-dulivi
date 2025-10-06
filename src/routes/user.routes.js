import express from 'express'
import authToken from '../middlewares/authToken.js'
import userController from '../controllers/user/user.controller.js'

const router = express.Router()

router.post('/api/user/code', userController.requestCode)
router.post('/api/user/verify', userController.verifyCode)
router.get('/api/user/all', authToken, userController.getAll)
router.get('/api/user/id', authToken, userController.getById)
router.put('/api/user/update', authToken, userController.update)
router.delete('/api/user/delete', authToken, userController.delete)

export default router
