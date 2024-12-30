const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin/adminContoller')
const customerController = require('../controllers/admin/customerController')
const categoryController = require('../controllers/admin/categoryController')
const productController = require('../controllers/admin/productController')
const adminAuth = require('../middlewares/adminauthMiddleware')


const passport = require('passport')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/login', adminController.loadLogin, adminAuth.isLoggedIn);
router.post('/login', adminController.login);
router.get('/dashboard',adminController.loadDashboard, adminAuth.isLoggedIn)

router.get('/customers',customerController.loadCustomers)
router.post('/addCustomer', customerController.addCustomer);
router.get('/customers/:id', customerController.getUserDetails);
router.patch('/customers/:id', customerController.updateUserDetails);
router.get('/customers/sort', customerController.getSortedCustomers);

router.get('/category',categoryController.loadCategory)
router.get('/addCategory', categoryController.loadAddCategory) 
router.post('/addCategory', categoryController.saveCategory);
router.patch('/updateCategory', categoryController.updateCategory);
router.delete('/deleteCategory/:id', categoryController.deleteCategory);





router.get('/products',productController.loadProducts)
router.get('/addProduct',productController.loadAddProducts)
// router.post('/addProduct', productController.addProduct);
router.post('/addProduct', upload.array('images', 4), productController.addProduct);
router.get('/listProduct/:id',productController.listProduct)
router.get('/unlistProduct/:id',productController.unlistProduct)
router.post('/toggleProduct/:id', productController.toggleProduct)
router.get('/editProduct',productController.loadEditProduct) 
router.get('/search',productController.searchProduct)
router.get('/products/:id', productController.getProductDetails);
router.post('/editProduct/:id',upload.array('images',4),productController.editProduct)
// router.patch('/editProduct/', productController.updateProduct);
router.post('/deleteImage',productController.deleteSingleImage)


router.get('/logout',adminController.logout,adminAuth.isLoggedIn)
module.exports = router