
const loadProfile = (req,res) =>{
    try {
        res.render('user/profile')
    } catch (error) {
        
    }
}

const loadEditAddress = (req,res)=>{
    try {
        res.render('user/edit-address')
    } catch (error) {
        
    }
}

const loadAddAddress = (req,res) =>{
    try {
        res.render('user/add-address')
    } catch (error) {
        
    }
}

const loadCheckOut = (req,res) =>{
    try {
        res.render('user/checkout')
    } catch (error) {
        
    }
}

const loadOrders = (req,res) =>{
    try {
        res.render('user/orders')
    } catch (error) {
        
    }
}

module.exports = {
    loadProfile,
    loadEditAddress,
    loadAddAddress,
    loadCheckOut,
    loadOrders
}