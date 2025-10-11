import express from 'express'
import authToken from '../middlewares/authToken.js'
import storyDayController from '../controllers/store/storyDay.controller.js'

const router = express.Router()

router.post('/api/store-day/upsert', authToken, storyDayController.upsert)
router.get('/api/store-day/all', storyDayController.getAll)
router.get('/api/store-day', storyDayController.getById)
router.put('/api/store-day/update/:id', authToken, storyDayController.update)
router.delete('/api/store-day/delete/:id', authToken, storyDayController.delete)

export default router
