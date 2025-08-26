const Product = require('../../models/productSchema')
const Category = require('../../models/categorySchema');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs')
const env = require('dotenv').config()
const mongoose = require('mongoose');
const { findById } = require('../../models/userScehma');



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

const loadEditProduct = async (req, res) => {
    try {

        let productId = req.query.id

        if (!productId) {
            return redirect('/admin/product?message:Product ID is missing!')
        }

        let product = await Product.findById(productId)

        if (!product) {
            return redirect('/admin/product?message:Product not found!')
        }
        let statusOptions = await Product.schema.path('status').enumValues
        let categories = await Category.find({})
        res.render('admin/editProduct', {
            product,
            categories,
            statusOptions
        })
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the edit product page. Please try again shortly.' })
    }
}

const editProduct = async (req, res) => {
    try {

        const {id}=req.body
        const { productName, authorName, category, status, publishDate, publisher, regularPrice, productOffer, numberPage, quantity, description } = req.body;
const product = await Product.findById(id);
        if (!id) {
            return res.redirect('/admin/product?message=Product ID missing!');
        }
        
        let categoryDoc=await Category.findOne({_id:category})
        if(!categoryDoc){
            return res.redirect('/admin/product?message:Invalid category!')
        }

        const salePrice = Math.round(regularPrice - (regularPrice * productOffer) / 100);

        if(req.files&&req.files.length>0){
            req.files.forEach(file=>{
                const relPath='uploads/product-images/'+file.filename
                if(!product.image.includes(relPath)&&product.image.length<4){
                    product.image.push(relPath)
                }
            })
        }

        await product.save()

        const updated = await Product.findByIdAndUpdate(
            id,{
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
            },
            {new:true}
        )

        if (!updated) {
            return res.redirect('/admin/product?message=Product not found for update!');
        }

    //    res.redirect('/admin/product?message=Product edited successfully.')
       res.json({ success: true, message: 'Product edited successfully.' });

    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while edit product. Please try again shortly.' })
    }
}

const deleteImage=async (req,res)=>{
try {
    const { id, img } = req.query;
    if (!id || !img) return res.json({success: false, message: "Missing params"});
    const product = await Product.findById(id);
    if (!product) return res.json({success: false, message: "Product not found"});

    // Remove image from DB array
    product.image = product.image.filter(i => i !== img);
    await product.save();

    // Remove file from disk
    const fs = require('fs');
    const imgPath = require('path').join('public', img); // assuming "uploads/..." is relative from /public
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    res.json({success: true});
  } catch (err) {
    res.json({success: false, message: "Server error"});
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
    loadViewProduct,
    editProduct,
    deleteImage
}