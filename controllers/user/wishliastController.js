const Category = require('../../models/categorySchema')
const User = require('../../models/userScehma')

const loadWishlist = async (req, res) => {
    try {
        const categories = await Category.find({})

        const id = req.session.userData
        if (!id) {
            return res.redirect('/user/login', {
                message: '', categories
            })
        }

        const user = await User.findById(id).populate('wishlist')

        res.render('user/wishlist', {
            categories,
            products: user.wishlist
        })
    } catch (error) {
        console.error(error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while load wishlist. Please try again shortly.' })

    }
}


const addToWishlist = async (req, res) => {
    try {
        const categories = await Category.find({})

        const id = req.session.userData
        if (!id) {
            return res.redirect('/user/login', {
                message: '', categories
            })
        }

        const productId = req.body.productId
        const user = await User.findById(id)
        const index = user.wishlist.indexOf(productId);

        if (index === -1) {
            user.wishlist.push(productId);
        } else {
            user.wishlist.splice(index, 1);
        }

        await user.save();

        res.json({
            success: true,
            inWishlist: index === -1
        });

    } catch (error) {
        console.error(error);
        res.render('user/pageNotFound',
            { message: 'Something went wrong while add to wishlist. Please try again shortly.' })

    }
}
module.exports = {
    loadWishlist,
    addToWishlist
}