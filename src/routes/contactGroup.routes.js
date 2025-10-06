import express from 'express'
import authToken from '../middlewares/authToken.js'
import contactGroupController from '../controllers/message/contactGroup.controller.js'

const router = express.Router()

router.post('/api/contact-group/upsert', authToken, contactGroupController.upsert)
router.post('/api/contact-group/bulk-upsert', authToken, contactGroupController.upsertGroupContacts)
router.get('/api/contact-group/all', authToken, contactGroupController.getAll)
router.get('/api/contact-group', authToken, contactGroupController.getById)
router.put('/api/contact-group/update/:id', authToken, contactGroupController.update)
router.delete('/api/contact-group/delete/:id', authToken, contactGroupController.delete)

export default router
