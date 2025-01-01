const express = require('express')
const router = express.Router()

const userController = require('../controllers/user/userController')
const passport = require('passport')
const userAuth = require('../middlewares/userAuth')
const productDetails = require('../controllers/user/productsDetails')



router.get('/home',userController.loadHomePage)
router.get('/pageNotFound',userController.pageNotFound)
router.get('/signup',userController.loadSignup)
router.post('/signup',userController.signup)
router.post('/verify-otp',userController.verifyOtp)




router.post('/resend-otp',userController.resentOtp)



 router.get('/logout',userController.logout)

 router.get('/otp', userController.loadOTPPage);


router.get('/login',userController.loadLogin)
router.post('/login',userController.login)


router.get('/forgott-password',userController.loadForgottPassword)
router.post('/forgott-password',userController.forgottPassword)
router.get('/otp-forgot',userController.loadOTPForgot)

router.post('/verify-forgot-otp',userController.verifyForgotOtp)
router.get('/reset-password',userController.loadResetPassword)
router.post('/reset-password',userController.resetPassword)

router.post('/resend-forgot-otp',userController.resentForgotOtp)


router.get('/productDetails',productDetails.productDetails)












module.exports = router


    