
const { emit, render } = require('../../app');
const User = require('../../models/userSchema');
const nodemailer = require('nodemailer');
const env = require('dotenv').config();
const bcrypt = require('bcrypt');
const category = require('../../models/categorySchema');
const Product = require('../../models/productSchema');
const Category = require('../../models/categorySchema');




const productDetails = async (req, res) => {
    try {
        const id = req.query.id;

        // Fetch the main product and populate its category
        const product = await Product.findOne({ _id: id }).populate('category');

        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Convert the product name to uppercase for display
        product.productName = product.productName.toUpperCase();

        // Fetch suggested products with the same category, excluding the current product
        let suggestedProducts = await Product.find({
            category: product.category._id,
            _id: { $ne: id }, // Exclude the current product
        })
        .sort({ createdAt: -1 })
            .limit(6); // Limit the number of suggestions to 5

            if (suggestedProducts.length === 0) {
                suggestedProducts = await Product.find()
                    .sort({ createdAt: -1 }) // Sort by newest first
                    .limit(6); // Limit to 5 products
            }
    
        const categories = await category.find();

        // Render the page with the product and suggestions
        res.render('user/productDetail', {
            product,
            categories,
            suggestedProducts, // Pass the suggested products to the template
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};
const loadReview = async (req, res) => {
    try {
        const id = req.query.id;
        const ObjectId = mongoose.Types.ObjectId;

        // Fetch the product and its category
        const product = await Product.findOne({ _id: id }).populate('category');
        
        if (!product) {
            return res.status(404).send('Product not found');
        }

        // Fetch reviews for the current product (use the correct field name)
        // Make sure ObjectId is instantiated correctly using `new`
        const reviews = await Review.find({ Product: new ObjectId(id) });

        product.productName = product.productName.toUpperCase();
        let suggestedProducts = await Product.find({
            category: product.category._id,
            _id: { $ne: id }, // Exclude the current product
        })
        .sort({ createdAt: -1 })
            .limit(6); // Limit the number of suggestions to 5

            if (suggestedProducts.length === 0) {
                suggestedProducts = await Product.find()
                    .sort({ createdAt: -1 }) // Sort by newest first
                    .limit(6); // Limit to 5 products
            }
    
        // const categories = await category.find();
        console.log('reviews:', reviews);  // Log to verify reviews are fetched

        if (!reviews || reviews.length === 0) {
            console.log('No reviews found for this product');
        }

        const categories = await Category.find();

        // Render the page with product, categories, and reviews
        res.render('user/product-review', {
            product,
            categories,
            reviews, 
            suggestedProducts,
             // Pass reviews to the template
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    productDetails
}
