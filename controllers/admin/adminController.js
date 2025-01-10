const { emit } = require('../../app')

const env = require('dotenv').config()
// const {emit} = require('../../app')

const loadLogin = (req,res) =>{
    try {
        res.render('admin/login')
    } catch (error) {
       console.error(error.message);
        
    }
}

const changePassword = (req,res)=>{
    try {
        res.render('admin/changePassword')
    } catch (error) {
        
    }
}

const loadDashboard = (req,res) =>{
    try {
        res.render('admin/dashboard')
    } catch (error) {
        
    }
}



module.exports = {
    loadLogin,
    changePassword,
    loadDashboard
}