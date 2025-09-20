const Product = require('../../models/productSchema')
const Category = require('../../models/categorySchema');

const loadOffer = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const totalProducts = await Product.countDocuments()

       
        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalPages = Math.ceil(totalProducts / limit)



        const now = new Date();
        await Product.updateMany(
            { expireOfferDate: { $lte: now } },
            { $unset: { startOfferDate: "", expireOfferDate: "", productOffer: '' } }
        );

        res.render('admin/offers', {
            products,
            currentPage:page,
            totalPages
        })
    } catch (error) {

    }
}




module.exports = {
    loadOffer
}