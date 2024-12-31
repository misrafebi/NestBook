const { emit } = require('../../app');
const env = require('dotenv').config()
const Category = require('../../models/categorySchema')


const loadCategory = async (req, res) => {
    try {

        if (req.session.admin) {
            const categories = await Category.find();

            res.render('admin/category', {
                categories,
                errorMessage: '',
                successMessage: ''
            });

        } else {
            res.redirect('/admin/dashboard');
        }

    } catch (error) {
        console.error('Error loading categories:', error);
        res.redirect('/admin/login');
    }
};



const loadAddCategory = async (req, res) => {

    try {

        if (req.session.admin) {
            const categories = await Category.find({}, 'name'); 
            res.render('admin/addCategory', {
                categories,
                successMessage: '',
                errorMessage: ''
            });

        } else {
            res.redirect('/admin/dashboard');
        }

    } catch (error) {

        console.log(error);
        res.redirect('/admin/login');
    }
};



const saveCategory = async (req, res) => {
    try {

        const { name, description, parentCategory } = req.body;
        // const existingCategory = await Category.findOne({ name });
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });

        const categories = await Category.find({}, 'name');

        if (existingCategory) {
            return res.render('admin/addCategory', {
                categories,
                errorMessage: 'Category name already exists. Please use a different name.',
                successMessage: ''
            });
        }

        const newCategory = new Category({
            name,
            description,
            parentCategory: parentCategory || null, 
        });
        await newCategory.save();

        res.render('admin/category', {
            categories: await Category.find(),
            successMessage: 'Category added successfully!',
            errorMessage: ''
        });

    } catch (error) {
        console.log(error);
        res.redirect('/admin/login');
    }
};



// const updateCategory = async (req, res) => {
//     try {

//         const { id, name, description, parentCategory } = req.body;

//         console.log('Request Body:', req.body);
//         const categories = await Category.find({}, 'name'); 

//         const existingCategory = await Category.findOne({ name, _id: { $ne: id } });

//         if (existingCategory) {
//             return res.render('admin/category', {
//                 categories,
//                 errorMessage: 'Category name already exists',
//                 successMessage: ''
//             })
//         }

//         await Category.findByIdAndUpdate(id, {
//             name,
//             description,
//             parentCategory,
//         });
        
//         res.render('admin/category', {
//             categories,
//             errorMessage: '', // Should be empty if no error
//             successMessage: 'Category updated successfully' // Success message
//         });
//         console.log('Error Message:', errorMessage);
// console.log('Success Message:', successMessage);


//     } catch (error) {
//         console.error('Error updating category:', error);
//         res.redirect('/admin/login');
//     }
// };

////////////////////////////////

// const updateCategory = async (req, res) => {
//     try {
//         const { id, name, description, parentCategory } = req.body;

//         console.log('Request Body:', req.body);

//         // Check if the category name already exists, excluding the current category
//         const existingCategory = await Category.findOne({ name, _id: { $ne: id } });

//         if (existingCategory) {
//             return res.render('admin/category', {
//                 categories: await Category.find({}, 'name'),
//                 errorMessage: 'Category name already exists',
//                 successMessage: ''
//             });
//         }

//         // Update the category if no name conflict
//         await Category.findByIdAndUpdate(id, {
//             name,
//             description,
//             parentCategory,
//         });

//         // After updating, render the category page with success message
//         return res.render('admin/category', {
//             categories: await Category.find({}, 'name'),
//             errorMessage: '',
//             successMessage: 'Category updated successfully'
//         });
        
//     } catch (error) {
//         console.error('Error updating category:', error);

//         // In case of an error, redirect to login page or render with an error message
//         return res.redirect('/admin/login');
//     }
// };

////////////////////////
const updateCategory = async (req, res) => {
    try {
        const { id, name, description, parentCategory } = req.body;

        console.log('Request Body:', req.body);
        const existingCategory = await Category.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });

        // Check if the category name already exists, excluding the current category
        // const existingCategory = await Category.findOne({ name, _id: { $ne: id } });

        if (existingCategory) {
            return res.json({
                success: false,
                errorMessage: 'Category name already exists',
            });
        }

        // Update the category if no name conflict
        await Category.findByIdAndUpdate(id, {
            name,
            description,
            parentCategory,
        });

        // Send success message
        return res.json({
            success: true,
            successMessage: 'Category updated successfully',
        });
    } catch (error) {
        console.error('Error updating category:', error);

        // Send error response
        return res.json({
            success: false,
            errorMessage: 'An error occurred while updating the category.',
        });
    }
};


// const deleteCategory = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const category = await Category.findByIdAndDelete(id);

//         if (!category) {
//             return res.json({
//                 success: false,
//                 message: 'Category not found.'
//             })
//             // return res.redirect('/admin/category?error=Category not found.');
//         }

//         res.redirect('/admin/category?success=Category deleted successfully.');
//         return res.json({
//             success: true,
//             message: 'Category deleted successfully.',
//             redirect: '/admin/category',
//         })
//     } catch (error) {
//         console.error('Error deleting category:', error);
//         // res.redirect('/admin/category?error=Failed to delete category. Please try again.');
//     }
// };

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.json({
                success: false,
                message: 'Category not found.',
            });
        }

        return res.json({
            success: true,
            message: 'Category deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.json({
            success: false,
            message: 'Failed to delete category. Please try again.',
        });
    }
};



module.exports = {
    deleteCategory,
    updateCategory,
    saveCategory,
    loadAddCategory,
    loadCategory
}