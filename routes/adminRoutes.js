const express = require('express')
const router = express.Router()

const adminContoller = require('../controllers/admin/adminContoller')
const passport = require('passport')

router.get('/login', adminContoller.loadLogin);
router.post('/login', adminContoller.login);
router.get('/',adminContoller.loadDashboard)
router.get('/customers',adminContoller.loadCustomers)
router.get('/category',adminContoller.loadCategory)

module.exports = router
