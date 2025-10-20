import express from 'express'
import authToken from '../middlewares/authToken.js'
import complementGroupComplementsController from '../controllers/store/complementGroupComplements.controller.js'

const router = express.Router()

router.post('/api/complement-group-complements/upsert', authToken, complementGroupComplementsController.upsert)
router.post('/api/complement-group-complements/bulk-upsert', authToken, complementGroupComplementsController.upsertGroupComplements)
router.get('/api/complement-group-complements/all', complementGroupComplementsController.getAll)
router.get('/api/complement-group-complements/', complementGroupComplementsController.getById)
router.put('/api/complement-group-complements/update/:id', authToken, complementGroupComplementsController.update)
router.delete('/api/complement-group-complements/delete/:id', authToken, complementGroupComplementsController.delete)

export default router
