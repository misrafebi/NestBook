const env = require('dotenv').config

const loadCustomer = (req,res) =>{
    try {
        res.render('admin/customers')
    } catch (error) {
        
    }
}

module.exports = {
    loadCustomer
}