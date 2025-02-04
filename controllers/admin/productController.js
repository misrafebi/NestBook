const Product = require('../../models/productSchema')
const Category = require('../../models/categorySchema');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs')
const env = require('dotenv').config()
const mongoose = require('mongoose');



const loadProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const totalProducts = await Product.countDocuments()

        const categories = await Category.find({})
        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalPages = Math.ceil(totalProducts / limit)
        res.render('admin/products', {
            message: '',
            categories,
            products,
            currentPage: page,
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
        const products = await Product.find({})
        const categories = await Category.find({})
        res.render('admin/addProduct', { categories, message: '', products })
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the add product page. Please try again shortly.' })
    }
}


const addProduct = async (req, res) => {
    try {
        const normalizePath = (filePath) => {
            return filePath.replace(/^.*\/uploads\//, 'uploads/');
        };
        const categories = await Category.find({});
        const { productName, authorName, category, status, publishDate, publisher, regularPrice, productOffer, numberPage, quantity, description } = req.body;

        if (!category || category === 'Select category') {
            return res.render('admin/addProduct', {
                message: 'Category cannot be empty. Please select or enter a valid category.',
                categories
            });
        }

        if (!req.files || req.files.length === 0) {
            return res.render('admin/addProduct', {
                categories,
                message: 'Please upload at least one product image.'
            });
        }

        const images = [];
        const uploadDir = path.join('public', 'uploads', 'product-images');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        for (let file of req.files) {
            const originalImagePath = file.path;
            const resizedImagePath = path.join(uploadDir, file.filename);

            await sharp(originalImagePath)
                .resize({ width: 440, height: 440 })
                .toFile(resizedImagePath);

            images.push(normalizePath(resizedImagePath));
        }

        const productExists = await Product.findOne({
            productName: { $regex: `${productName}$`, $options: 'i' }
        });

        if (productExists) {
            return res.render('admin/addProduct', {
                message: `Product: ${productName} already exists.`,
                categories
            });
        }

        let categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            categoryDoc = new Category({ name: category, description: '' });
            await categoryDoc.save();
        }

        const salePrice = Math.round(regularPrice - (regularPrice * productOffer) / 100);

        const newProduct = new Product({
            image: images,
            productName,
            authorName,
            category: categoryDoc._id,
            status,
            publishDate,
            publisher,
            regularPrice,
            productOffer,
            numberPage,
            quantity,
            description,
            salePrice
        });

        await newProduct.save();
        // console.log('Product added with images:', newProduct.image);

        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const totalProducts = await Product.countDocuments()

        // const categories=await Category.find({})
        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
        const totalPages = Math.ceil(totalProducts / limit)

        return res.render('admin/products', {
            message: 'Product added successfully.',
            products,
            totalPages,
            currentPage: page
        });
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login', {
            message: 'Something went wrong while adding the product. Please try again shortly.'
        });
    }
};
const loadEditProduct = (req, res) => {
    try {
        res.render('admin/editProduct')
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the edit product page. Please try again shortly.' })
    }
}

const loadViewProduct = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id).populate('category')
        if (!product) {
            return console.log('product is not defined');

        }

        res.render('admin/viewProduct', {
            message: '',
            product,
            category: product.category
        })
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the view product page. Please try again shortly.' })
    }
}
module.exports = {
    loadProduct,
    loadAddProduct,
    loadEditProduct,
    addProduct,
    loadViewProduct
}