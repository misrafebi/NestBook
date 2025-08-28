const express = require('express')
const router = express.Router()

const Customer = require('../models/userScehma')

const adminController = require('../controllers/admin/adminController')
const categoryController = require('../controllers/admin/categoryController')
const couponController = require('../controllers/admin/couponController')
const customerController = require('../controllers/admin/cusomerController')
const offerController = require('../controllers/admin/OfferController')
const productController = require('../controllers/admin/productController')
const reviewController = require('../controllers/admin/reviewController')
const orderController = require('../controllers/admin/orderController')

const adminAuth = require('../middlewares/adminAuth')

const multer = require('multer')
const path = require('path')
const fs = require('fs')


// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = 'uploads/'
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true })
//         }
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });


////////////////
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadDir = 'uploads/';
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir, { recursive: true });
//         }
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         // Use Date.now with a random number suffix to ensure uniqueness
//         cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
//     }
// });
///////////



// for (let file of req.files) {
//     const originalImagePath = file.path;

//     // Create unique filename for resized image
//     const resizedFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
//     const resizedImagePath = path.join(uploadDir, resizedFilename);

//     await sharp(originalImagePath)
//         .resize({ width: 440, height: 440 })
//         .toFile(resizedImagePath);

//     images.push(normalizePath(resizedImagePath));
// }
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'public/uploads/product-images';
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random()*1E6) + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only .png, .jpg, .jpeg images are allowed'));
        }
        cb(null, true);
    }
});



router.get('/login', adminAuth.noCache, adminAuth.isLogin, adminController.loadLogin);
router.post('/login', adminAuth.noCache, adminController.login, adminAuth.checkSession);

router.get('/dashboard', adminAuth.noCache, adminAuth.checkSession, adminController.loadDashboard);
router.get('/logout', adminAuth.noCache, adminController.logout, adminAuth.checkSession)

 
router.get('/changePassword', adminAuth.noCache, adminAuth.checkSession, adminController.loadChangePassword)
router.post('/changePassword', adminAuth.noCache, adminAuth.checkSession, adminController.changePassword)

router.get('/category', adminAuth.noCache, adminAuth.checkSession, categoryController.loadCategory)
router.post('/edit-category/:id', adminAuth.noCache, adminAuth.checkSession, categoryController.editCategory)
router.post('/add-category', adminAuth.noCache, adminAuth.checkSession, categoryController.addCategory)
router.delete('/deleteCategory/:id', adminAuth.noCache, adminAuth.checkSession, categoryController.deleteCategory);

router.get('/coupon', adminAuth.noCache, adminAuth.checkSession,couponController.laodCoupon)
router.get('/addCoupon',adminAuth.noCache, adminAuth.checkSession, couponController.loadAddCoupon)
router.get('/editCoupon',adminAuth.noCache, adminAuth.checkSession, couponController.loadEditCoupon)

router.get('/customer', adminAuth.noCache, adminAuth.checkSession, customerController.loadCustomer)
router.get('/edit-customer/:id', adminAuth.noCache, adminAuth.checkSession, customerController.loadEditCustomer)
router.post('/update-customer/:id', adminAuth.noCache, adminAuth.checkSession, customerController.editCustomer)
router.get('/addCustomer', adminAuth.noCache, adminAuth.checkSession, customerController.loadAddCustomer)
router.post('/addCustomer', adminAuth.noCache, adminAuth.checkSession, customerController.addCustomer)

router.get('/offer', adminAuth.noCache, adminAuth.checkSession,offerController.loadOffer)
 
router.get('/product',adminAuth.noCache, adminAuth.checkSession, productController.loadProduct)
router.get('/addProduct',adminAuth.noCache, adminAuth.checkSession, productController.loadAddProduct)
router.post('/addProduct', adminAuth.noCache, adminAuth.checkSession,upload.array('images', 4), productController.addProduct)
router.get('/viewProduct/:id',adminAuth.noCache, adminAuth.checkSession,productController.loadViewProduct)
router.get('/editProduct', adminAuth.noCache, adminAuth.checkSession,productController.loadEditProduct)
router.post('/editProduct',adminAuth.noCache,adminAuth.checkSession,upload.array('newImages', 4),productController.editProduct)
router.delete('/deleteProductImage',productController.deleteImage)
router.put('/:id/block',productController.toggleBlock)

router.get('/review', adminAuth.noCache, adminAuth.checkSession, reviewController.loadReviews)
router.get('/reply/:id', adminAuth.noCache, adminAuth.checkSession, reviewController.loadReply)
router.post('/reply/:id', adminAuth.noCache, adminAuth.checkSession,reviewController.postReply)

router.get('/orders',adminAuth.noCache, adminAuth.checkSession, orderController.loadOrders)

module.exports = router