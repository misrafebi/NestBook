const { emit } = require('../../app');
const Admin = require('../../models/adminSchema');
const nodemailer = require('nodemailer')
const env = require('dotenv').config()
const bcrypt = require('bcrypt');
const Category = require('../../models/categorySchema')
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

// const loadCustomers = async (req, res) => {
//     const { sort, order } = req.query;
//     const sortField = sort || 'name';
//     const sortOrder = order === 'desc' ? -1 : 1;
//     try {
//         // const customers = await Customer.find().sort({ [sortField]: sortOrder });
//         // res.json(customers);

//         if (req.session.admin) {
//             // Fetch customers from the database
//             const customers = await User.find();
//             res.render('admin/customers', { customers });
//         } else {
//             res.redirect('/admin/login');
//         }
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error loading customers');
//     }
// };


// const addCustomer = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Validation
//         if (!name || !email || !password) {
//             return res.status(400).json({ message: 'All fields are required' });
//         }

//         // Check if the email already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: 'Customer already exists' });
//         }

//         // Add to database
//         const newUser = new User({
//             name,
//             email,
//             password,
//             isActive: true, // Set active by default
//             isAdmin: false, // Set admin to false
//         });
//         await newUser.save();

//         res.status(201).json({ message: 'Customer added successfully' });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error adding customer', error: err.message });
//     }
// }


// // Fetch user details
// const getUserDetails = async (req, res) => {
//     try {

//         const { id } = req.params;
//         const customer = await User.findById(id);
//         res.json(customer);

//         // const user = await User.findById(req.params.id);
//         // res.status(200).json(user);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error fetching user details', error: err.message });
//     }
// };

// // Update user details
// const updateUserDetails = async (req, res) => {
//     try {
//         const { name, email, password, isActive } = req.body;
//         const updates = { name, email, isActive };

//         if (password) {
//             updates.password = password; // Update password only if provided
//         }

//         const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
//         res.status(200).json({ message: 'User updated successfully', user });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error updating user', error: err.message });
//     }
// };

// const getSortedCustomers = async (req, res) => {
//     try {
//         const { field = 'name', order = 'asc' } = req.query;
//         const validFields = ['name', 'createdAt'];
//         if (!validFields.includes(field)) {
//             return res.status(400).json({ message: 'Invalid sort field' });
//         }
//         const sortOrder = order === 'asc' ? 1 : -1;

//         const customers = await User.find().sort({ [field]: sortOrder });
//         res.status(200).json(customers);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Error fetching sorted customers', error: err.message });
//     }
// };




// const loadCategory = (req, res) => {
//     if (req.session.admin) {
//         res.render('admin/category')
//     } else {
//         res.redirect('/login');
//     }
// }

// const loadCategory = async (req, res) => {
//     try {
//         if (req.session.admin) {
//             // Fetch categories from the database
// // Example MongoDB Query to Fetch Categories
// const categories = await Category.find();

//             // Render the view and pass the categories
//             res.render('admin/category', { categories });
//         } else {
//             res.redirect('/admin/login');
//         }
//     } catch (error) {
//         console.error('Error loading categories:', error);
//         res.redirect('/error');
//     }
// };


// // const loadAddCategory = (req, res) => {
// //     if (req.session.admin) {
// //         res.render('admin/addCategory')
// //     } else {
// //         res.redirect('/login');
// //     }
// // }
// const loadAddCategory = async (req, res) => {
//     if (req.session.admin) {
//         try {
//             const categories = await Category.find({}, 'name'); // Retrieve only names
//             res.render('admin/addCategory', { categories });
//         } catch (error) {
//             console.log(error);
//             res.redirect('/error');
//         }
//     } else {
//         res.redirect('/login');
//     }
// };



// const saveCategory = async (req, res) => {
//     try {
//         const { name, description, parentCategory } = req.body;

//         const newCategory = new Category({
//             name,
//             description,
//             parentCategory: parentCategory || null, // Handle optional parentCategory
//         });

//         await newCategory.save();
//         res.redirect('/admin/category'); // Redirect to category listing
//     } catch (error) {
//         console.log(error);
//         res.redirect('/error');
//     }
// };


// // const updateCategory = async (req, res) => {
// //     try {
// //         const { id, name, description, parentCategory } = req.body;

// //         // Update the category in the database
// //         await Category.findByIdAndUpdate(id, {
// //             name,
// //             description,
// //             parentCategory,
// //         });

// //         res.status(200).json({ success: true, message: 'Category updated successfully' });
// //     } catch (error) {
// //         console.error('Error updating category:', error);
// //         res.status(500).json({ success: false, message: 'Failed to update category' });
// //     }
// // };

// const updateCategory = async (req, res) => {
//     try {
//         const { id, name, description, parentCategory } = req.body;

//         console.log('Request Body:', req.body);

//         // Check if the category name already exists, excluding the current category
//         const existingCategory = await Category.findOne({ name, _id: { $ne: id } });

//         if (existingCategory) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Category name already exists',
//             });
//         }

//         // Update the category in the database
//         await Category.findByIdAndUpdate(id, {
//             name,
//             description,
//             parentCategory,
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Category updated successfully',
//         });
//     } catch (error) {
//         console.error('Error updating category:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to update category',
//         });
//     }
// };


// // const loadEditCategory = (req, res) => {
// //     if (req.session.admin) {
// //         res.render('admin/editCategory')
// //     } else {
// //         res.redirect('/login');
// //     }
// // }

// const deleteCategory = async (req, res) => {
//     try {
//         const { id } = req.params; // Get category ID from the URL

//         // Find and delete the category by ID
//         const category = await Category.findByIdAndDelete(id);

//         if (!category) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Category not found',
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: 'Category deleted successfully',
//         });
//     } catch (error) {
//         console.error('Error deleting category:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Failed to delete category',
//         });
//     }
// };



// const loadProducts = (req, res) => {
//     if (req.session.admin) {
//         res.render('admin/products')
//     } else {
//         res.redirect('/login');
//     }
// }

// const loadAddProducts = (req, res) => {
//     if (req.session.admin) {
//         res.render('admin/addProduct')
//     } else {
//         res.redirect('/admin/login');
//     }
// }

// const loadEditProduct = (req, res) => {
//     if (req.session.admin) {
//         res.render('admin/editProduct')
//     } else {
//         res.redirect('/login');
//     }
// }
module.exports = {
    loadLogin,
    login,
    loadDashboard,
    
    // loadCategory,
    // loadAddCategory,
    // // loadEditCategory,
    // deleteCategory,
    // updateCategory,
    // loadProducts,
    // loadAddProducts,
    // loadEditProduct,
    
    // saveCategory,

}