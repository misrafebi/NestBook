const env = require('dotenv').config()
const Category = require('../../models/categorySchema')
// const { options } = require('../../routes/adminRouter')

const loadCategory = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('admin/categories', {
            message: '',
            categories
        })
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the category page. Please try again shortly.' })
    }
}

const editCategory = async (req, res) => {
    try {
        const { id } = req.params
        const { name, description } = req.body

        const categories = await Category.find({})

        const categoryExist = await Category.findOne({
            name: { $regex: `^${name}$`, $options: 'i' },
            _id: { $ne: id }
        })

        if (categoryExist) {
            console.log('category already exists.');
            return res.render('admin/categories', {
                message: `Category ${name} already exists.`,
                categories
            })
        }
        await Category.findByIdAndUpdate(id, { name, description })

        res.redirect('/admin/category?message=Category updated successfully.')

    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while editing category. Please try again shortly.' })
    }
}

const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body

        const categories = await Category.find({})

        const categoryExist = await Category.findOne({
            name: { $regex: `${name}$`, $options: 'i' }
        })

        if (categoryExist) {
            return res.render('admin/categories', {
                message: `Category ${name} already exists.`,
                categories
            })
        }

        const newCategory = new Category({ name, description })
        await newCategory.save()

        res.redirect('/admin/category?message=Category added successfully.')
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while add category. Please try again shortly.' })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params
        const category = await Category.findByIdAndDelete(id)

        if (!category) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        return res.status(200).json({ message: 'Category deleted successfully.' });


    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while delete category. Please try again shortly.' })
    }
}



module.exports = {
    loadCategory,
    editCategory,
    addCategory,
    deleteCategory
}