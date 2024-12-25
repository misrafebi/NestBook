const express = require('express')
const router = express.Router()

const userController = require('../controllers/user/userController')
const passport = require('passport')

router.get('/',userController.loadHomePage)
router.get('/pageNotFound',userController.pageNotFound)
router.get('/signup',userController.loadSignup)
router.post('/signup',userController.signup)
router.post('/verify-otp',userController.verifyOtp)


// router.post('/verify-otp', (req, res) => {
//     const { otp } = req.body;

//     // Replace this with your actual OTP validation logic
//     if (otp === '123456') { 
//         return res.json({ success: true, redirect: '/' });
//     } else {
//         return res.json({ success: false, message: 'Invalid OTP' });
//     }
// });

router.post('/resend-otp',userController.resentOtp)
router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/signup'}),(req,res)=>{
    res.redirect('/')
})


router.get('/login',userController)

module.exports = router