const { emit } = require('../../app');
const Product = require('../../models/productSchema')
const Category = require('../../models/categorySchema')
const User = require('../../models/userSchema')
const bcrypt = require('bcrypt');
const env = require('dotenv').config()
const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

// const loadProducts = (req, res) => {
//     // if (req.session.admin) {
//         res.render('admin/products')
//     // } else {
//         // res.redirect('/login');
//     // }
// }

const loadProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }); // Fetch products sorted by insertion order
        res.render('admin/products', { products }); // Pass products to the EJS template
    } catch (error) {
        console.error("Error loading products:", error);
        res.status(500).send("Internal Server Error");
    }
};

const loadAddProducts = async (req, res) => {

    try {
        const categories = await Category.find({ isListed: true }, 'name')
        res.render('admin/addProduct',{categories})
    } catch (error) {
        res.redirect('/admin/login');
    }
}

const listProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndUpdate(productId, { isBlocked: false });
        res.redirect('/admin/products'); // Redirect back to the products page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

const unlistProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndUpdate(productId, { isBlocked: true });
        res.redirect('/admin/products'); // Redirect back to the products page
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}

const toggleProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        product.isBlocked = !product.isBlocked; // Toggle the status
        await product.save();
        res.json({ success: true, isBlocked: product.isBlocked });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

// const toggleProduct = async (req, res) => {
//     try {
//         const productId = req.params.id;

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).send('Product not found');
//         }

//         // Toggle the status
//         product.status = product.status === 'Listed' ? 'Unlisted' : 'Listed';
//         await product.save();

//         res.redirect('/admin/products');
//     } catch (error) {
//         console.error('Error toggling product status:', error);
//         res.status(500).send('Internal Server Error');
//     }
// };


// const addProduct = async (req, res) => {
//     try {
//         // Extract data from the request body
//         const { name, price, offer, category, numOfPage, stock, publishDate, publisher, description, authorName } = req.body;

//         // Convert offer to percentage if not empty
//         // const productOffer = offer ? parseFloat(offer) : 0;

//         // Calculate sale price
//         const regularPrice = price;
//         const productOffer = offer || 0; // Default to 0 if no offer
//         const salePrice = regularPrice - productOffer;
//         // Prepare the product data
//         const productData = {
//             productName: name,
//             regularPrice,
//             salePrice,
//             productOffer,
//             category,
//             quantity: parseInt(stock),
//             numberOfPage: numOfPage ? parseInt(numOfPage) : undefined,
//             publishDate,
//             publisher,
//             description,
//             authorName,
//             // productImage: [], // You may populate this from uploaded files if needed
//         };



//         const productName = await Product.find({}, 'name');

//         if(!productName){
//             const product = new Product(productData);
//             await product.save();
//             res.redirect('/admin/products');
//         }else{
//             res.send('product already exist')
//         }

//         // Save the product to the database
        

//         // Redirect back to the product list page
//          // Update this to your desired route
//     } catch (error) {
//         console.error('Error adding product:', error);
//         res.redirect('/admin/addProduct'); // Redirect back to the form in case of error
//     }
// };


const addProduct = async (req, res) => {
    try {
        // Extract data from the request body
        const { name, price, offer, category, numOfPage, stock, publishDate, publisher, description, authorName } = req.body;

        // Calculate sale price
        const regularPrice = parseFloat(price);
        const productOffer = parseFloat(offer) || 0; // Default to 0 if no offer
        const salePrice = regularPrice - productOffer;

        // Check if the product name already exists
        const existingProduct = await Product.findOne({ productName: name });

        if (existingProduct) {
            return res.status(400).send('Product with this name already exists. Please use a different name.');
        }

        // Prepare the product data
        const productData = {
            productName: name.trim(), // Trim to avoid whitespace issues
            regularPrice,
            salePrice,
            productOffer,
            category,
            quantity: parseInt(stock),
            numberOfPage: numOfPage ? parseInt(numOfPage) : undefined,
            publishDate,
            publisher,
            description,
            authorName,
        };

        // Save the product to the database
        const product = new Product(productData);
        await product.save();

        // Redirect back to the product list page
        res.redirect('/admin/products');
    } catch (error) {
        console.error('Error adding product:', error);
        res.redirect('/admin/addProduct'); // Redirect back to the form in case of error
    }
};

// const addProduct = async (req, res) => {
//     try {
//         const { name, price, offer, category, numOfPage, stock, publishDate, publisher, description, authorName } = req.body;

//         const regularPrice = parseFloat(price);
//         const productOffer = parseFloat(offer) || 0;
//         const salePrice = regularPrice - productOffer;

//         const existingProduct = await Product.findOne({ productName: name });

//         if (existingProduct) {
//             return res.status(400).send('Product with this name already exists. Please use a different name.');
//         }

//         const productData = {
//             productName: name.trim(),
//             regularPrice,
//             salePrice,
//             productOffer,
//             category,
//             quantity: parseInt(stock),
//             numberOfPage: numOfPage ? parseInt(numOfPage) : undefined,
//             publishDate,
//             publisher,
//             description,
//             authorName,
//             status: 'Listed', // Default status
//         };

//         const product = new Product(productData);
//         await product.save();

//         res.redirect('/admin/products');
//     } catch (error) {
//         console.error('Error adding product:', error);
//         res.redirect('/admin/addProduct');
//     }
// };


const loadEditProduct = (req, res) => {
    if (req.session.admin) {
        res.render('admin/editProduct')
    } else {
        res.redirect('/login');
    }
}

module.exports = {
    loadProducts,
    loadEditProduct,
    loadAddProducts,
    addProduct,
    listProduct,
    unlistProduct,
    toggleProduct
}