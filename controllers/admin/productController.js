const Product = require('../../models/productSchema')
const Category = require('../../models/categorySchema');
const { options } = require('../../routes/adminRouter');
const loadProduct =async (req, res) => {
    try { 
        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const totalProducts=await Product.countDocuments()

        const categories=await Category.find({})
        const products=await Product.find({})
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit)

        const totalPages=Math.ceil(totalProducts/limit)
        res.render('admin/products', { 
            message: '',
            categories,
            products,
currentPage:page,
totalPages
         })
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the products page. Please try again shortly.' })
    }
} 

const loadAddProduct = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('admin/addProduct', { categories, message: '' })
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the add product page. Please try again shortly.' })
    }
}


const addProduct = async (req, res) => {
    try {
        const categories = await Category.find({})
        const { productName, authorName, category, status, publishDate, publisher, regularPrice, productOffer, numberPage, quantity, description } = req.body

        if (!category || category == 'Select category') {
            return res.render('admin/addProduct', {
                message: 'Category cannot be empty. Please select or enter a valid category.',
                categories
            })
        }

        const productExists = await Product.findOne({
            productName: { $regex: `${productName}$`, $options: 'i' }
        })

        if (productExists) {
            return res.render('admin/addProduct',
                { message: `Product :${productName} already exists.`, categories })

        }
        let categoryDoc = await Category.findOne({ name: category })
        if (!categoryDoc) {
            categoryDoc = new Category({ name: category, description: '' })
            await categoryDoc.save()
        }

        const salePrice = Math.round(regularPrice - (regularPrice * productOffer) / 100);

        const newProduct = new Product({
            productName,
            authorName,
            category: categoryDoc._id,
            status, publishDate,
            publisher,
            regularPrice,
            productOffer,
            numberPage,
            quantity,
            description,
            salePrice
        })

        await newProduct.save()

        return res.render('admin/products',
            { message: 'product added successfully.' })

    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while add product. Please try again shortly.' })
    }
}

const loadEditProduct = (req, res) => {
    try {
        res.render('admin/editProduct')
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the edit product page. Please try again shortly.' })
    }
}

module.exports = {
    loadProduct,
    loadAddProduct,
    loadEditProduct,
    addProduct
}