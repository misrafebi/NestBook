const { emit } = require('../../app');
const User = require('../../models/userSchema')
const bcrypt = require('bcrypt');
const env = require('dotenv').config()


const loadCustomers = async (req, res) => {
    const { sort, order } = req.query;
    const sortField = sort || 'name';
    const sortOrder = order === 'desc' ? -1 : 1;
    try {
        // const customers = await Customer.find().sort({ [sortField]: sortOrder });
        // res.json(customers);

        if (req.session.admin) {
            // Fetch customers from the database
            const customers = await User.find();
            res.render('admin/customers', { customers });
        } else {
            res.redirect('/admin/login');
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


// Fetch user details
const getUserDetails = async (req, res) => {
    try {

        const { id } = req.params;
        const customer = await User.findById(id);
        res.json(customer);

        // const user = await User.findById(req.params.id);
        // res.status(200).json(user);
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
        const { field = 'name', order = 'asc' } = req.query;
        const validFields = ['name', 'createdAt'];
        if (!validFields.includes(field)) {
            return res.status(400).json({ message: 'Invalid sort field' });
        }
        const sortOrder = order === 'asc' ? 1 : -1;

        const customers = await User.find().sort({ [field]: sortOrder });
        res.status(200).json(customers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching sorted customers', error: err.message });
    }
};

module.exports = {
    getSortedCustomers,
    updateUserDetails,
    getUserDetails,
    addCustomer,
    loadCustomers,
}