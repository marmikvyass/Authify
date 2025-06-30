import express from 'express'
import { register, userLogin, userLogout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword } from '../controllers/auth.js'
import userAuth from '../middleware/userAuth.js'

const router = express.Router()

router.post('/signin', register)
router.post('/login', userLogin)
router.post('/logout', userLogout)
router.post('/sendverifyotp', userAuth, sendVerifyOtp)
router.post('/verifyaccount', userAuth, verifyEmail)
router.get('/isAuth', userAuth, isAuthenticated)
router.post('/resetOTP', sendResetOtp)  
router.post('/resetPassword', resetPassword)


export default router