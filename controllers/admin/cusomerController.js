const env = require('dotenv').config
const { find } = require('../../models/adminSchema')
const User = require('../../models/userScehma')
const bcrypt = require('bcrypt')

const loadCustomer = async (req, res) => {
    try {
        const customers = await User.find({}).sort({ createOn: -1 })
        res.render('admin/customers', {
            message: '',
            customers,
        })
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the customers page. Please try again shortly.' })
    }
}

const loadEditCustomer = async (req, res) => {
    try {
        const customerId = req.params.id
        const customer = await User.findById(customerId);
        const customers = await User.find({})
        if (!customer) {
            res.render('admin/customers', { message: 'Customer not found', customers })
        }
        res.render('admin/editcustomer', { message: '', customer })
    } catch (error) {
        console.error('Error:', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the edit customers page. Please try again shortly.' })
    }
}

const editCustomer = async (req, res) => {
    try {
        const customerId = req.params.id
        const { name, email, password, phone, isBlocked } = req.body

        const existingUser = await User.findOne({
            email: { $regex: `^${email}`, $options: 'i' },
            _id: { $ne: customerId }
        })

        if (existingUser) {
            const customer = await User.findById(customerId)

            return res.render('admin/customers', {
                message: `Email ${email} is already in use by another customer.`,
                customers: await User.find({})
            })
        }

        const currentUser = await User.findById(customerId)
        if (!currentUser) {
            return res.render('admin/customers', {
                message: `Customer with ID ${customerId} not found.`,
                customers: await User.find({})
            })
        }

        const updates = { name, email, phone, isBlocked }

        if (password) {
            const hashedPass = await bcrypt.hash(password, 10)
            updates.password = hashedPass
        }

        const customer = await User.findByIdAndUpdate(customerId, updates, { new: true, runValidators: true })
        const customers = await User.find({})
        return res.render('admin/customers',
            { message: 'User updated successfully', customers })
    } catch (error) {
        console.error('Error:', error);
        res.render('admin/login',
            { message: 'Something went wrong while editing customers. Please try again shortly.' })
    }
}

const loadAddCustomer = async (req, res) => {
    try {
        res.render('admin/addCustomer',{message:''})
    } catch (error) {
        console.error('Error:', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the add customers page. Please try again shortly.' })
    }
}

const addCustomer = async (req, res) => {
    try {
        const { name, email, phone, password, isBlocked } = req.body;

        if (!email) {
            return res.render('admin/addCustomer', {
                message: 'Email is required.',
            })
        }

        const customer = await User.findOne({ email })
        if (customer) {
            return res.render('admin/addCustomer', {
                message: `Customer with email ${email} already exists.`
            })

        }

        const hashedPass = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,
            password: hashedPass,
            email,
            phone,
            isBlocked
        })

        await newUser.save()

        return res.render('admin/addCustomer',
            { message: 'Customer added successfully.' })

    } catch (error) {
        console.error('Error', error);
        res.render('admin/login',
            { message: 'Something went wrong while add customers. Please try again shortly.' })
    }
}


module.exports = {
    loadCustomer,
    loadEditCustomer,
    editCustomer,
    loadAddCustomer,
    addCustomer,
}