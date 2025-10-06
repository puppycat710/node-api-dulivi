import express from 'express'
import authToken from '../middlewares/authToken.js'
import openingHourController from '../controllers/store/openingHour.controller.js'

const router = express.Router()

router.post('/api/opening-hours/upsert', authToken, openingHourController.upsert)
router.get('/api/opening-hours/all', openingHourController.getAll)

export default router
