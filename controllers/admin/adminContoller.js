const { emit } = require('../../app');
const Admin = require('../../models/adminSchema');
const nodemailer = require('nodemailer')
const env = require('dotenv').config()
const bcrypt = require('bcrypt');
const User = require('../../models/userSchema')
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

const loadCustomers = async (req, res) => {
    try {
        if (req.session.admin) {
            // Fetch customers from the database
            const customers = await User.find();
            res.render('admin/customers', { customers });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading customers');
    }
};


const addCustomer = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

         // Check if the email already exists
         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(400).json({ message: 'Customer already exists' });
         }

        // Add to database
        const newUser = new User({
            name,
            email,
            password,
            isActive: true, // Set active by default
            isAdmin: false, // Set admin to false
        });
        await newUser.save();

        res.status(201).json({ message: 'Customer added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error adding customer', error: err.message });
    }
}

// const User = require('../models/userModel');

// Fetch user details
const getUserDetails = async (req, res) => {
    try {
        
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user details', error: err.message });
    }
};

// Update user details
const updateUserDetails = async (req, res) => {
    try {
        const { name, email, password, isActive } = req.body;
        const updates = { name, email, isActive };

        if (password) {
            updates.password = password; // Update password only if provided
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
};

const getSortedCustomers = async (req, res) => {
    try {
        const { field, order } = req.query; // field: 'name' or 'createdAt', order: 'asc' or 'desc'
        const sortOrder = order === 'asc' ? 1 : -1; // MongoDB sorting order
        const customers = await User.find()
            .sort({ [field]: sortOrder }) // Sort by dynamic field
            .exec();
        
        res.status(200).json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching sorted customers', error: err.message });
    }
};



const loadCategory = (req, res) => {
    if (req.session.admin) {
        res.render('admin/category')
    } else {
        res.redirect('/login');
    }
}

const loadAddCategory = (req, res) => {
    if (req.session.admin) {
        res.render('admin/addCategory')
    } else {
        res.redirect('/login');
    }
}

const loadEditCategory = (req, res) => {
    if (req.session.admin) {
        res.render('admin/editCategory')
    } else {
        res.redirect('/login');
    }
}

const loadProducts = (req, res) => {
    if (req.session.admin) {
        res.render('admin/products')
    } else {
        res.redirect('/login');
    }
}

const loadAddProducts = (req, res) => {
    if (req.session.admin) {
        res.render('admin/addProduct')
    } else {
        res.redirect('/login');
    }
}

const loadEditProduct = (req, res) => {
    if (req.session.admin) {
        res.render('admin/editProduct')
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
    loadAddCategory,
    loadEditCategory,
    loadProducts,
    loadAddProducts,
    loadEditProduct,
    addCustomer,
    getUserDetails,
    updateUserDetails,
    getSortedCustomers,
}