const { emit } = require('../../app')

const env = require('dotenv').config()
// const {emit} = require('../../app')
const Admin = require('../../models/adminSchema')

const loadLogin = (req,res) =>{
    try {
        res.render('admin/login')
    } catch (error) {
       console.error(error.message);
       res.render('admin/login')
    }
}
 
const login= async (req,res)=>{
    try {
        const {email,password}=req.body
        const admin = await Admin.findOne({email})
        
      if(!admin){
            return res.send('Admin does not exist')
        }

        res.render('admin/dashboard')
    } catch (error) {
        console.error(error.message);
        res.render('admin/login')
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
    loadDashboard,
    login
}