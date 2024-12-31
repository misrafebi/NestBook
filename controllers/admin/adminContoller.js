const { emit } = require('../../app');
const Admin = require('../../models/adminSchema');
const nodemailer = require('nodemailer')
const env = require('dotenv').config()
const bcrypt = require('bcrypt');
const Category = require('../../models/categorySchema')
const Usere = require('../../models/userSchema')

const loadLogin = (req, res) => {
    console.log('Rendering admin login page...');
    res.render('admin/login', { errorMessage: '' })

}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.render('admin/login', { errorMessage: 'Admin does not exist' });
        }

        if (password !== admin.password) {
            return res.render('admin/login', { errorMessage: 'Incorrect Password' });
        }

        req.session.admin = true;
        res.redirect('/admin/dashboard')

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).render('admin/login', { errorMessage: 'Internal Server Error' });
    }
};



const loadDashboard = (req, res) => {
    res.render('admin/dashboard');
};


const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.redirect('/admin/login');
    });
};


module.exports = {
    loadLogin,
    login,
    loadDashboard,
    logout
}