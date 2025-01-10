const { loadCategory } = require('./categoryController')

const env = require('dotenv').config()

const laodCoupon = (req,res) =>{
    try {
        res.render('admin/coupon')
    } catch (error) {
        
    }
}

const loadAddCoupon = (req,res) =>{
    try {
        res.render('admin/addcoupon')
    } catch (error) {
        
    }
}

const loadEditCoupon = (req,res) =>{
    try {
        res.render('admin/editcoupon')
    } catch (error) {
        
    }
}

module.exports ={
    laodCoupon,
    loadAddCoupon,
    loadEditCoupon
}