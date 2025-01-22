const env = require('dotenv').config
const User=require('../../models/userScehma')
const loadCustomer =async (req,res) =>{
    try {
        const users=await User.find({users})
        res.render('admin/customers',users)
    } catch (error) {
        console.error('Error: ',error);
        res.render('admin/login',
            {message:'Something went wrong while loading the customers page. Please try again shortly.' })
    }
}

module.exports = {
    loadCustomer
}