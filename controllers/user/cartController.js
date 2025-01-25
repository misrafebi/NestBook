const Category = require('../../models/categorySchema')

const loadCart = async (req, res) => {
    try {
        const categories = await Category.find({})
        res.render('user/cart', { categories })
    } catch (error) {

    }
}

module.exports = {
    loadCart
}