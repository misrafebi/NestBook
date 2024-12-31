const express = require('express')
const router = express.Router()

const adminController = require('../controllers/admin/adminContoller')
const customerController = require('../controllers/admin/customerController')
const categoryController = require('../controllers/admin/categoryController')
const productController = require('../controllers/admin/productController')
const adminAuth = require('../middlewares/adminauthMiddleware')
// const noCache = require('../middlewares/noCache'); // Import the middleware


const passport = require('passport')
const multer = require('multer');
const path = require('path');
// const upload = multer({ dest: 'uploads/' });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Save images in the 'uploads' folder
//     },
//     filename: (req, file, cb) => {
//         // Preserve the original file name with extension
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });
// const upload = multer({
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
//         if (!allowedTypes.includes(file.mimetype)) {
//             return cb(new Error('Only .png, .jpg, .jpeg images are allowed'));
//         }
//         cb(null, true);
//     }
// });
// Setup multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save images to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Use original file extension
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
router.post('/login',adminAuth.noCache, adminController.login,adminAuth.checkSession);
router.get('/dashboard',adminAuth.noCache, adminAuth.checkSession,adminController.loadDashboard)
router.get('/logout',adminAuth.noCache,adminController.logout,adminAuth.checkSession)

router.get('/customers',adminAuth.noCache,adminAuth.checkSession,customerController.loadCustomers)
router.post('/addCustomer',adminAuth.noCache,adminAuth.checkSession, customerController.addCustomer);
router.get('/customers/:id',adminAuth.noCache,adminAuth.checkSession, customerController.getUserDetails);
router.patch('/customers/:id',adminAuth.noCache,adminAuth.checkSession, customerController.updateUserDetails);
router.get('/customers/sort', adminAuth.noCache,adminAuth.checkSession,customerController.getSortedCustomers);

router.get('/category',adminAuth.noCache, adminAuth.checkSession, categoryController.loadCategory,adminAuth.checkSession)
router.get('/addCategory',adminAuth.noCache, adminAuth.checkSession, categoryController.loadAddCategory,adminAuth.checkSession) 
router.post('/addCategory',adminAuth.noCache, adminAuth.checkSession, categoryController.saveCategory,adminAuth.checkSession);
router.patch('/updateCategory',adminAuth.noCache, adminAuth.checkSession, categoryController.updateCategory,adminAuth.checkSession);
router.delete('/deleteCategory/:id',adminAuth.noCache, adminAuth.checkSession, categoryController.deleteCategory,adminAuth.checkSession);





router.get('/products', adminAuth.noCache, adminAuth.checkSession, productController.loadProducts)
router.get('/addProduct', adminAuth.checkSession, productController.loadAddProducts)
// router.post('/addProduct', productController.addProduct);
router.post('/addProduct', adminAuth.checkSession, upload.array('images', 4), productController.addProduct);
router.get('/listProduct/:id',adminAuth.checkSession, productController.listProduct)
router.get('/unlistProduct/:id',adminAuth.checkSession, productController.unlistProduct)
router.post('/toggleProduct/:id',adminAuth.checkSession, productController.toggleProduct)
router.get('/editProduct',adminAuth.checkSession, productController.loadEditProduct) 
router.get('/search',adminAuth.checkSession, productController.searchProduct)
router.get('/products/:id',adminAuth.checkSession, productController.getProductDetails);
router.post('/editProduct/:id',adminAuth.checkSession, upload.array('images',4),productController.editProduct)
// router.patch('/editProduct/', productController.updateProduct);
router.post('/deleteImage',adminAuth.checkSession, productController.deleteSingleImage)


module.exports = router