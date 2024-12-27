const express = require('express')
const router = express.Router()

const adminContoller = require('../controllers/admin/adminContoller')
const passport = require('passport')

router.get('/login', adminContoller.loadLogin);
router.post('/login', adminContoller.login);
router.get('/',adminContoller.loadDashboard)

router.get('/customers',adminContoller.loadCustomers)
router.post('/addCustomer', adminContoller.addCustomer);
router.get('/customers/:id', adminContoller.getUserDetails);
router.patch('/customers/:id', adminContoller.updateUserDetails);
router.get('/customers/sort', adminContoller.getSortedCustomers);

router.get('/category',adminContoller.loadCategory)
router.get('/addCategory', adminContoller.loadAddCategory) 
router.post('/addCategory', adminContoller.saveCategory);
router.patch('/updateCategory', adminContoller.updateCategory);

// router.get('/editCategory', adminContoller.loadEditCategory)


router.get('/products',adminContoller.loadProducts)
router.get('/addProduct',adminContoller.loadAddProducts)
router.get('/editProduct',adminContoller.loadEditProduct)
module.exports = router