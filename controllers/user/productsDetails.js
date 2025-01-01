
const { emit, render } = require('../../app');
const User = require('../../models/userSchema');
const nodemailer = require('nodemailer');
const env = require('dotenv').config();
const bcrypt = require('bcrypt');
const category = require('../../models/categorySchema');
const Product = require('../../models/productSchema');
const Category = require('../../models/categorySchema');

// const productDetails = async (req, res) => {
//     try {
//         const id = req.query.id;
//         const product = await Product.findOne({ _id: id })
//         const categories = await category.find();
//         if (!product) {
//             return res.status(404).send('Product not found');
//         }
        
//         product.productName = product.productName.toUpperCase();

//         res.render('user/productDetail', { product, categories });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Internal Server Error');
//     }
// };

const productDetails = async (req, res) => {
    try {
        const id = req.query.id;
        // Use populate to fetch category name
        const product = await Product.findOne({ _id: id }).populate('category'); 

        if (!product) {
            return res.status(404).send('Product not found');
        }

        product.productName = product.productName.toUpperCase();

        res.render('user/productDetail', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    productDetails
}
