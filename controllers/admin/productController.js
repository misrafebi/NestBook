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

        const now = new Date();
        await Product.updateMany(
            { expireOfferDate: { $lte: now } },
            { $unset: { startOfferDate: "", expireOfferDate: "", productOffer: '' } }
        );

        await Product.updateMany(
            { productOffer: { $eq: '' } },
            { $unset: { startOfferDate: "", expireOfferDate: "", productOffer: "" } }
        );

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
        const categories = await Category.find({});
        const {
            productName,
            authorName,
            category,
            status,
            publishDate,
            publisher,
            regularPrice,
            productOffer,
            numberPage,
            quantity,
            description,
            startOffer,
            expireOffer
        } = req.body;

        // Validate required fields
        if (!category || category === 'Select category') {
            return res.render('admin/addProduct', {
                message: 'Category cannot be empty. Please select or enter a valid category.',
                categories
            });
        }

        // Handle images (Required)
        let images = [];
        const uploadDir = path.join('public', 'uploads', 'product-images');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        if (!req.files || req.files.length === 0) {
            return res.render('admin/addProduct', {
                categories,
                message: 'Please upload at least one product image.'
            });
        }

        // Process and resize images
        for (let i = 0; i < req.files.length && images.length < 4; i++) {
            const file = req.files[i];
            const originalImagePath = file.path;
            const resizedImagePath = path.join(uploadDir, 'resized-' + file.filename);

            await sharp(originalImagePath)
                .resize({ width: 440, height: 440 })
                .toFile(resizedImagePath);

            images.push('uploads/product-images/' + 'resized-' + file.filename);
        }

        // Check for existing product
        const productExists = await Product.findOne({
            productName: { $regex: `^${productName}$`, $options: 'i' }
        });

        if (productExists) {
            return res.render('admin/addProduct', {
                message: `Product: ${productName} already exists.`,
                categories
            });
        }

        // Find or create category
        let categoryDoc = await Category.findOne({ name: category });
        if (!categoryDoc) {
            categoryDoc = new Category({ name: category, description: '' });
            await categoryDoc.save();
        }

        // Calculate sale price
        const salePrice = Math.round(regularPrice - (regularPrice * (productOffer || 0) / 100));

        // check offer greater than 100%
        if (productOffer > 100) {
            return res.render('admin/addProduct', {
                message: 'Product offer should be below 100%',
                categories
            })
        }

        // check if expire date is exists or not
        if (productOffer && !expireOffer) {
            return res.render('admin/addProduct', {
                message: 'Expire offer date should not be empty',
                categories
            })
        }
        // check if start offer date is exists or not
        if (productOffer && !startOffer) {
            return res.render('admin/addProduct', {
                message: 'Start offer date should not be empty',
                categories
            })
        }

        if (productOffer && startOffer && expireOffer && new Date(expireOffer) <= new Date(startOffer)) {
            return res.render('admin/addProduct', {
                message: 'Expire offer date must be after or equal to the start offer date.',
                categories
            });
        }


        // Create product
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
            salePrice,
            startOfferDate: startOffer,
            expireOfferDate: expireOffer
        });

        await newProduct.save();

        // Get paginated product list
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const totalProducts = await Product.countDocuments();
        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        const totalPages = Math.ceil(totalProducts / limit);

        // Respond with JSON (for AJAX form) or render as needed
        return res.json({ success: true, message: 'Product added successfully.' });


    } catch (error) {
        console.error('Error: ', error);
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while adding the product.'
        });
    }
};

// module.exports = { addProduct };


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
            statusOptions,
            message:''
        })
    } catch (error) {
        console.error('Error: ', error);
        res.render('admin/login',
            { message: 'Something went wrong while loading the edit product page. Please try again shortly.' })
    }
}

const editProduct = async (req, res) => {
    try {

        const { id } = req.body
        const { productName, authorName, category, status, publishDate, publisher, regularPrice, productOffer, numberPage, quantity, description, startOffer, expireOffer } = req.body;
        const product = await Product.findById(id);
        if (!id) {
            return res.redirect('/admin/product?message=Product ID missing!');
        }

        let categoryDoc = await Category.findOne({ _id: category })
        if (!categoryDoc) {
            return res.redirect('/admin/product?message:Invalid category!')
        }

        const salePrice = Math.round(regularPrice - (regularPrice * productOffer) / 100);

        let statusOptions = await Product.schema.path('status').enumValues
        let categories = await Category.find({})
        if (productOffer > 100) {
            return res.render('admin/editProduct', {
                message: 'Product offer should be below 100%',
                product,
                categories,
                statusOptions
            })
        }

        if (productOffer && !expireOffer) {
            return res.render('admin/editProduct', {
                message: 'Expire offer date should not be empty',
                product,
                categories,
                statusOptions
            })
        }
        if (productOffer && !startOffer) {
            return res.render('admin/editProduct', {
                message: 'Start offer date should not be empty',
                product,
                categories,
                statusOptions
            })
        }
        if (productOffer && startOffer && expireOffer && new Date(expireOffer) <= new Date(startOffer)) {
            return res.render('admin/editProduct', {
                message: 'Expire offer date must be after or equal to the start offer date.',
                product,
                categories,
                statusOptions
            });
        }


        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const relPath = 'uploads/product-images/' + file.filename
                if (!product.image.includes(relPath) && product.image.length < 4) {
                    product.image.push(relPath)
                }
            })
        }

        await product.save()

        const updated = await Product.findByIdAndUpdate(
            id, {
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
            salePrice,
            startOfferDate: startOffer,
            expireOfferDate: expireOffer
        },
            { new: true }
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

const deleteImage = async (req, res) => {
    try {
        const { id, img } = req.query;
        if (!id || !img) return res.json({ success: false, message: "Missing params" });
        const product = await Product.findById(id);
        if (!product) return res.json({ success: false, message: "Product not found" });

        // Remove image from DB array
        product.image = product.image.filter(i => i !== img);
        await product.save();

        // Remove file from disk
        const fs = require('fs');
        const imgPath = require('path').join('public', img); // assuming "uploads/..." is relative from /public
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

        res.json({ success: true });
    } catch (err) {
        console.log('Error', err);
        res.json({ success: false, message: "Something went wrong while delete image. Please try again shortly." });
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

const toggleBlock = async (req, res) => {
    try {
        const { id } = req.params
        const product = await Product.findById(id)

        if (!product) return res.json({ success: false, message: 'Product not found' });

        product.isBlocked = !product.isBlocked
        await product.save()

        res.json({ success: true, message: product.isBlocked })

    } catch (error) {
        console.error('Error', error);
        res.json('Something went wrong while toggle block/ unblock product. Please try again shortly.')
    }
}
module.exports = {
    loadProduct,
    loadAddProduct,
    loadEditProduct,
    addProduct,
    loadViewProduct,
    editProduct,
    deleteImage,
    toggleBlock
}