const express = require('express')
const router = express.Router()
const Customer=require('../models/userScehma')

const adminController = require('../controllers/admin/adminController')
const categoryController = require('../controllers/admin/categoryController')
const couponController = require('../controllers/admin/couponController')
const customerController = require('../controllers/admin/cusomerController')
const offerController = require('../controllers/admin/OfferController')
const productController = require('../controllers/admin/productController')
const reviewController = require('../controllers/admin/reviewController')
const orderController = require('../controllers/admin/orderController')

const adminAuth = require('../middlewares/adminAuth')


router.get('/login', adminAuth.noCache, adminAuth.isLogin, adminController.loadLogin);
router.post('/login', adminAuth.noCache, adminController.login,adminAuth.checkSession);

router.get('/dashboard', adminAuth.noCache, adminAuth.checkSession, adminController.loadDashboard);
router.get('/logout',adminAuth.noCache,adminController.logout,adminAuth.checkSession)


router.get('/changePassword', adminAuth.noCache,adminAuth.checkSession,adminController.loadChangePassword)
router.post('/changePassword',adminAuth.noCache,adminAuth.checkSession,adminController.changePassword)

router.get('/category', categoryController.loadCategory)

router.get('/coupon', couponController.laodCoupon)
router.get('/addCoupon', couponController.loadAddCoupon)
router.get('/editCoupon', couponController.loadEditCoupon)

router.get('/customer', customerController.loadCustomer)
router.get('/edit-customer/:id',customerController.loadEditCustomer)
router.post('/update-customer/:id',customerController.editCustomer)
router.get('/addCustomer',customerController.loadAddCustomer)
router.post('/addCustomer',customerController.addCustomer)

router.get('/offer', offerController.loadOffer)

router.get('/product', productController.loadProduct)
router.get('/addProduct', productController.loadAddProduct)
router.get('/editProduct', productController.loadEditProduct)

router.get('/review', reviewController.loadReviews)
router.get('/replay', reviewController.loadReplay)

router.get('/orders', orderController.loadOrders)

module.exports = router