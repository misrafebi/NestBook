const { emit } = require('../../app');
const Admin = require('../../models/adminSchema');
const nodemailer = require('nodemailer')
const env = require('dotenv').config()
const bcrypt = require('bcrypt');
// const Admin = require('../../models/adminSchema');


const loadLogin = (req, res) => {
    // res.render('admin/login')
    console.log('Rendering admin login page...');
    res.render('admin/login')
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const admin = await Admin.findOne({ email });

        // If the user does not exist
        if (!admin) {
            return res.render('admin/login', { errorMessage: 'Admin does not exist' });
        }

        // Compare the plaintext password with the stored password
        if (password !== admin.password) {
            return res.render('admin/login', { errorMessage: 'Incorrect Password' });
        }

        // If login is successful, set session and render the home page
        req.session.admin = true;
        res.render('admin/dashboard', { successMessage: 'Login Successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).render('admin/login', { errorMessage: 'Internal Server Error' });
    }
};



const loadDashboard = (req, res) => {
    if (req.session.admin) {
        res.render('admin/dashboard');
    } else {
        res.redirect('/login');
    }
};

const loadCustomers = (req,res) => {
    if(req.session.admin){
        res.render('admin/customers')
    } else {
        res.redirect('/login');
    }
}

const loadCategory = (req, res) =>{
    if(req.session.admin){
        res.render('admin/category')
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    loadLogin,
    login,
    loadDashboard,
    loadCustomers,
    loadCategory,
}