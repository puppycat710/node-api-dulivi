import express from 'express'
// Store
import storeRoutes from './store.routes.js'
import openingHoursRoutes from './openingHour.routes.js'
import cityRoutes from './city.routes.js'
import deliveryAreaRoutes from './deliveryArea.routes.js'
import categoryRoutes from './category.routes.js'
import productRoutes from './product.routes.js'
import complementRoutes from './complement.routes.js'
import complementGroupRoutes from './complementGroup.routes.js'
// User
import userRoutes from './user.routes.js'
import sessionRoutes from './auth.routes.js'
import paymentRoutes from './payment.routes.js'
import orderRoutes from './order.routes.js'
// Message
import contactRoutes from './contact.routes.js'
import groupRoutes from './group.routes.js'
import contactGroupRoutes from './contactGroup.routes.js'
import messageRoutes from './message.routes.js'
// External APIs Services
import ibgeRoutes from './ibge.routes.js'
// Upload Image
import { multerMiddleware, uploadImage } from '../utils/uploadImage.js'

const router = express.Router()

router.post('/api/upload', multerMiddleware, uploadImage)
// Store
router.use(storeRoutes)
router.use(openingHoursRoutes)
router.use(cityRoutes)
router.use(deliveryAreaRoutes)
router.use(categoryRoutes)
router.use(productRoutes)
router.use(complementRoutes)
router.use(complementGroupRoutes)
// User
router.use(userRoutes)
router.use(sessionRoutes)
router.use(orderRoutes)
router.use(paymentRoutes)
// Message
router.use(contactRoutes)
router.use(groupRoutes)
router.use(contactGroupRoutes)
router.use(messageRoutes)
// External APIs Services
router.use(ibgeRoutes)

export default router
