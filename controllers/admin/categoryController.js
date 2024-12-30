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
        const existingCategory = await Category.findOne({ name });
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



const updateCategory = async (req, res) => {
    try {

        const { id, name, description, parentCategory } = req.body;

        console.log('Request Body:', req.body);
        const categories = await Category.find({}, 'name'); 

        const existingCategory = await Category.findOne({ name, _id: { $ne: id } });

        if (existingCategory) {
            return res.render('admin/addCategory', {
                categories,
                errorMessage: 'Category name already exists',
                successMessage: ''
            })
        }

        await Category.findByIdAndUpdate(id, {
            name,
            description,
            parentCategory,
        });

        res.render('admin/addCategory', {
            categories,
            errorMessage: '',
            successMessage: 'Category updated successfully'
        })

    } catch (error) {
        console.error('Error updating category:', error);
        res.redirect('/admin/category');
    }
};



const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return res.redirect('/admin/category?error=Category not found.');
        }

        res.redirect('/admin/category?success=Category deleted successfully.');
    } catch (error) {
        console.error('Error deleting category:', error);
        res.redirect('/admin/category?error=Failed to delete category. Please try again.');
    }
};


module.exports = {
    deleteCategory,
    updateCategory,
    saveCategory,
    loadAddCategory,
    loadCategory
}