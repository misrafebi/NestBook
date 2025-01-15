const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin/adminController')
const categoryController = require('../controllers/admin/categoryController')
const couponController = require('../controllers/admin/couponController')
const customerController = require('../controllers/admin/cusomerController')
const offerController = require('../controllers/admin/OfferController')
const productController = require('../controllers/admin/productController')
const reviewController = require('../controllers/admin/reviewController')
const orderController = require('../controllers/admin/orderController')

router.get('/dashboard',adminController.loadDashboard)

router.get('/login',adminController.loadLogin)
router.post('/login',adminController.login)
router.get('/changePassword',adminController.changePassword)

router.get('/category',categoryController.loadCategory)

router.get('/coupon',couponController.laodCoupon)
router.get('/addCoupon',couponController.loadAddCoupon)
router.get('/editCoupon',couponController.loadEditCoupon)

router.get('/customer',customerController.loadCustomer)

router.get('/offer',offerController.loadOffer)

router.get('/product',productController.loadProduct)
router.get('/addProduct',productController.loadAddProduct)
router.get('/editProduct',productController.loadEditProduct)

router.get('/review',reviewController.loadReviews)
router.get('/replay',reviewController.loadReplay)

router.get('/orders',orderController.loadOrders)

module.exports = router