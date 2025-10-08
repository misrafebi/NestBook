const Category = require('../../models/categorySchema')

const loadCart = async (req, res) => {
    try {
        const email = req.session.userData?.email
        const user = await User.findOne({ email })
        const categories = await Category.find({})

        res.render('user/cart', { categories,message:'' })
    } catch (error) {

    }
}

module.exports = {
    loadCart
}