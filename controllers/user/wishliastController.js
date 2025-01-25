const Category = require('../../models/categorySchema')
const loadWishlist = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/wishlist', { categories })
    } catch (error) {

    }
}

module.exports = {
    loadWishlist
}