import express from 'express'
import {processpayment , sendstripkey} from '../controller/paymentController.js'
const router = express.Router()
import {isauthenticated,ISAuthenticated,iSauthenticated,Isauthenticated,ISAUthenticated }from '../middleware/auth.js'


router.post('/payment/process',iSauthenticated, processpayment)
router.get('/stripekey', sendstripkey)
export default router
