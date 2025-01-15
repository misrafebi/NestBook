const express = require('express')
const router = express.Router()

const userController = require('../controllers/user/userController')
const productController = require('../controllers/user/productController')
const profileController = require('../controllers/user/profileController')
const cartController = require('../controllers/user/cartController')
const wishlistController = require('../controllers/user/wishliastController')
const walletController = require('../controllers/user/walletController')
 
router.get('/home',userController.loadHome)

router.get('/login',userController.loadLogin)

router.get('/signup',userController.loadSignup)
router.get('/signupOTP',userController.loadSignupOTP)

router.get('/forgotPassword',userController.loadForgotPassword)
router.get('/forgotMail',userController.loadForgotMail)
router.get('/forgotOTP',userController.loadForgotOTP)

router.get('/aboutUs',userController.loadAbout)

router.get('/contactUs',userController.loadContactUs)
  
router.get('/products',productController.loadProducts)
router.get('/productDetail',productController.loadProductDetail)
router.get('/productReview',productController.loadProductReview)

router.get('/profile',profileController.loadProfile)

router.get('/editAddress',profileController.loadEditAddress)
router.get('/addAddress',profileController.loadAddAddress)

router.get('/checkout',profileController.loadCheckOut)

router.get('/orders',profileController.loadOrders)

router.get('/cart',cartController.loadCart)

router.get('/wishlist',wishlistController.loadWishlist)

router.get('/wallet',walletController.loadWallet)
router.get('/addMoney',walletController.loadAddMoney)
router.get('/withdrawMoney',walletController.loadWithdrawMoney)

module.exports = router
