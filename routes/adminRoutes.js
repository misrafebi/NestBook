const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin/adminContoller')
const customerController = require('../controllers/admin/customerController')
const categoryController = require('../controllers/admin/categoryController')
const productController = require('../controllers/admin/productController')

const passport = require('passport')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/login', adminController.loadLogin);
router.post('/login', adminController.login);
router.get('/',adminController.loadDashboard)

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


// router.get('/editCategory', adminContoller.loadEditCategory)


router.get('/products',productController.loadProducts)
router.get('/addProduct',productController.loadAddProducts)
// router.post('/addProduct', productController.addProduct);
router.post('/addProduct', upload.array('images', 4), productController.addProduct);
router.get('/listProduct/:id',productController.listProduct)
router.get('/unlistProduct/:id',productController.unlistProduct)
router.post('/toggleProduct/:id', productController.toggleProduct)
router.get('/editProduct',productController.loadEditProduct) 
module.exports = router