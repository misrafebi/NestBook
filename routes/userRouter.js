const express = require('express')
const router = express.Router()
const passport = require('passport')

const userController = require('../controllers/user/userController')
const productController = require('../controllers/user/productController')
const profileController = require('../controllers/user/profileController')
const cartController = require('../controllers/user/cartController')
const wishlistController = require('../controllers/user/wishliastController')
const walletController = require('../controllers/user/walletController')

// router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))
// router.get('/auth/google/callback',
//     passport.authenticate('google',{failureRedirect:'/user/signup'}),
//     (req,res)=>{
//         console.log('User authenticated: ',req.user);
//         res.redirect('/user/home')
//     }
// )

router.get('/auth/google/signup', (req, res, next) => {
    req.session.authType = 'signup'
    next()
}, passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/login', (req, res, next) => {
    req.session.authType = 'login'
    next()
}, passport.authenticate('google', { scope: ['profile', 'email'] }))

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/user/signup' }),
    (req, res) => {
        const authType = req.session.authType
        const user = req.user

        if (authType === 'signup' && !user.newUser) {
            // if (!req.user.newUser) {
            req.flash('error', "You are already signed up. Please log in.")
            return res.redirect('/user/login')
            // }
        }
        if (authType === 'login' && user.newUser) {
            // if (req.user.newUser) {
            req.flash('error', 'You are not signed up. Please sign up first.')
            return res.redirect('/user/signup')
            // }
        }
        console.log('User authenticated:', req.user);
        res.redirect('/user/home')
    }
)
router.get('/home', userController.loadHome)

router.get('/login', userController.loadLogin)
router.post('/login', userController.login)

router.get('/signup', userController.loadSignup)
router.post('/signup', userController.signup)
router.get('/signupOTP', userController.loadSignupOTP)
router.post('/signupOTP', userController.verifySignupOtp)

router.get('/forgotMail', userController.loadForgotMail)
router.post('/forgotMail', userController.forgotMail);
router.get('/forgotOTP', userController.loadForgotOTP)
router.post('/forgotOTP', userController.verifyForgotOTP)
router.post('/resentForgotOTP',userController.resentForgotOTP)
router.get('/resetPassword', userController.loadForgotPassword)
router.post('/resetPassword', userController.resetPassword)

router.get('/logout', userController.logout)

router.get('/aboutUs', userController.loadAbout)

router.get('/contactUs', userController.loadContactUs)

router.get('/products', productController.loadProducts)
router.get('/productDetail', productController.productDetails)
router.get('/productReview', productController.loadReview)
router.post('/post-review',productController.postReview)

router.get('/profile', profileController.loadProfile)

router.get('/editAddress', profileController.loadEditAddress)
router.get('/addAddress', profileController.loadAddAddress)

router.get('/checkout', profileController.loadCheckOut)

router.get('/orders', profileController.loadOrders)

router.get('/cart', cartController.loadCart)

router.get('/wishlist', wishlistController.loadWishlist)

router.get('/wallet', walletController.loadWallet)
router.get('/addMoney', walletController.loadAddMoney)
router.get('/withdrawMoney', walletController.loadWithdrawMoney)

module.exports = router
