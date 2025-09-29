const { loadCategory } = require('./categoryController')

const env = require('dotenv').config()

const laodCoupon = (req,res) =>{
    try {
        res.render('admin/coupon')
    } catch (error) {
       console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while loading coupon page. Please try again shortly.' }) 
    }
}

const loadAddCoupon = (req,res) =>{
    try {
        res.render('admin/addcoupon')
    } catch (error) {
        console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while loading add coupon page. Please try again shortly.' })
    }
}

const loadEditCoupon = (req,res) =>{
    try {
        res.render('admin/editcoupon')
    } catch (error) {
        console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while load edit coupon page. Please try again shortly.' })
    }
}

module.exports ={
    laodCoupon,
    loadAddCoupon,
    loadEditCoupon
}