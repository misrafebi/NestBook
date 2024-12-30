const { emit } = require('../../app');
const User = require('../../models/userSchema')
const bcrypt = require('bcrypt');
const env = require('dotenv').config()


const loadCustomers = async (req, res) => {
    const { sort, order } = req.query;
    const sortField = sort || 'name';
    const sortOrder = order === 'desc' ? -1 : 1;

    try {

        if (req.session.admin) {
            const customers = await User.find({}).sort({ createdAt: -1 });
            res.render('admin/customers', {
                customers,
                errorMessage: '',
                successMessage: ''
            });

        } else {
            res.redirect('/admin/login');
        }

    } catch (err) {
        console.error(err);
        res.render('admin/customers', {
            customers,
            errorMessage: 'Error loading customers',
            successMessage: ''
        })
    }
};


const addCustomer = async (req, res) => {
    try {

        const { name, email, password } = req.body;
        const customers = await User.find();

        if (!name || !email || !password) {
            res.render('admin/customers', { customers });
            res.render('admin/customers', { customers });
            return res.render('admin/customers', {
                customers,
                errorMessage: 'All fields are required',
                successMessage: ''
            })
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render('admin/customers', {
                customers,
                errorMessage: 'Customer already exists',
                successMessage: ''
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);


        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            isActive: true,
            isAdmin: false,
        });

        await newUser.save();
        res.render('admin/customers', {
            customers,
            successMessage: 'Customer added successfully',
            errorMessage: ''
        })

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

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user details', error: err.message });
    }
};


const updateUserDetails = async (req, res) => {
    try {
        const { name, email, password, isActive } = req.body;
        const updates = { name, email, isActive };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updates.password = hashedPassword; 
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