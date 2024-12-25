const express = require('express')
const router = express.Router()

const userController = require('../controllers/user/userController')
const passport = require('passport')

router.get('/',userController.loadHomePage)
router.get('/pageNotFound',userController.pageNotFound)
router.get('/signup',userController.loadSignup)
router.post('/signup',userController.signup)
router.post('/verify-otp',userController.verifyOtp)


;

router.post('/resend-otp',userController.resentOtp)
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
    res.redirect('/')
})


router.get('/login',userController.loadLogin)
router.post('/login',userController.login)

 router.get('/logout',userController.logout)

 router.post('/forgot-password', userController.handleForgotPassword);
 router.get('/otp', userController.loadOTPPage);
 router.get('/forgot-password', userController.showForgotPasswordPage);

 // Handle Forgot Password form submission
 router.post('/verify-otp',userController.verifyForgotPasswordOtp)
router.post('/resetPassword',userController.resetPassword)

module.exports = router


    