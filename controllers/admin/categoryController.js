const { emit } = require('../../app');
const env = require('dotenv').config()
const Category = require('../../models/categorySchema')


const loadCategory = async (req, res) => {
    try {
        if (req.session.admin) {
            // Fetch categories from the database
// Example MongoDB Query to Fetch Categories
const categories = await Category.find();

            // Render the view and pass the categories
            res.render('admin/category', { categories });
        } else {
            res.redirect('/admin/login');
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        res.redirect('/error');
    }
};


// const loadAddCategory = (req, res) => {
//     if (req.session.admin) {
//         res.render('admin/addCategory')
//     } else {
//         res.redirect('/login');
//     }
// }
const loadAddCategory = async (req, res) => {
    if (req.session.admin) {
        try {
            const categories = await Category.find({}, 'name'); // Retrieve only names
            res.render('admin/addCategory', { categories });
        } catch (error) {
            console.log(error);
            res.redirect('/error');
        }
    } else {
        res.redirect('/login');
    }
};



const saveCategory = async (req, res) => {
    try {
        const { name, description, parentCategory } = req.body;

        const newCategory = new Category({
            name,
            description,
            parentCategory: parentCategory || null, // Handle optional parentCategory
        });

        await newCategory.save();
        res.redirect('/admin/category'); // Redirect to category listing
    } catch (error) {
        console.log(error);
        res.redirect('/error');
    }
};


// const updateCategory = async (req, res) => {
//     try {
//         const { id, name, description, parentCategory } = req.body;

//         // Update the category in the database
//         await Category.findByIdAndUpdate(id, {
//             name,
//             description,
//             parentCategory,
//         });

//         res.status(200).json({ success: true, message: 'Category updated successfully' });
//     } catch (error) {
//         console.error('Error updating category:', error);
//         res.status(500).json({ success: false, message: 'Failed to update category' });
//     }
// };

const updateCategory = async (req, res) => {
    try {
        const { id, name, description, parentCategory } = req.body;

        console.log('Request Body:', req.body);

        // Check if the category name already exists, excluding the current category
        const existingCategory = await Category.findOne({ name, _id: { $ne: id } });

        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'Category name already exists',
            });
        }

        // Update the category in the database
        await Category.findByIdAndUpdate(id, {
            name,
            description,
            parentCategory,
        });

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
        });
    }
};


// const loadEditCategory = (req, res) => {
//     if (req.session.admin) {
//         res.render('admin/editCategory')
//     } else {
//         res.redirect('/login');
//     }
// }

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params; // Get category ID from the URL

        // Find and delete the category by ID
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
        });
    }
};



module.exports ={
    deleteCategory,
    updateCategory,
    saveCategory,
    loadAddCategory,
    loadCategory
}