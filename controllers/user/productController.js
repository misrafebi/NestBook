const Category = require('../../models/categorySchema')

const loadProducts = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/products', { categories })
    } catch (error) {

    }
}

const loadProductDetail = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/product-details', { categories })
    } catch (error) {

    }
}

const loadProductReview = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/product-review', { categories })
    } catch (error) {

    }
}

module.exports = {
    loadProducts,
    loadProductDetail,
    loadProductReview
}