const Product = require('../../models/productSchema')
const Category = require('../../models/categorySchema');
const { findById } = require('../../models/userScehma');

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

        await Product.updateMany(
            { productOffer: { $eq: '' } },
            { $unset: { startOfferDate: "", expireOfferDate: "", productOffer: "" } }
        );


        res.render('admin/offers', {
            products,
            currentPage: page,
            totalPages,
            message: ''
        })
    } catch (error) {
        console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while load offer page. Please try again shortly.' })
    }
}

const editOffer = async (req, res) => {
    try {
        const { id } = req.params
        const { productOffer, startOfferDate, expireOfferDate } = req.body

        const page = parseInt(req.query.page) || 1
        const limit = 10
        const skip = (page - 1) * limit

        const totalProducts = await Product.countDocuments()


        const products = await Product.find({})
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const totalPages = Math.ceil(totalProducts / limit)

        if (productOffer && !expireOfferDate) {
            return res.render('admin/offers', {
                message: 'Expire offer date should not be empty',
                product,
                currentPage: page,
                totalPages
            })
        }
        if (productOffer && !startOfferDate) {
            return res.render('admin/offers', {
                message: 'Start offer date should not be empty',
                product,
                currentPage: page,
                totalPages
            })
        }
        if (productOffer && startOfferDate && expireOfferDate && new Date(expireOfferDate) <= new Date(startOfferDate)) {
            return res.render('admin/offers', {
                message: 'Expire offer date must be after or equal to the start offer date.',
                product,
                currentPage: page,
                totalPages
            });
        }


        const product = await Product.find({})

        await Product.findByIdAndUpdate(id, { productOffer, startOfferDate, expireOfferDate })

        res.redirect('/admin/offer?message=Offer updated successfully.')
    } catch (error) {
        console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while edit offer. Please try again shortly.' })
    }
}

const deleteOffer = async (req, res) => {
    try {

        const id = req.query.id
        if (!id) {
            return res.json({ success: false, message: 'Id can not found' })
        }

        const product = await Product.findById(id)
        if (!product) {
            return res.json({ success: false, message: 'Product can not found.' })
        }

        await Product.findByIdAndUpdate(id,{ productOffer: '', startOfferDate: '', expireOfferDate: '' })

        return res.json({ success: true, message: 'Offer deleted successfully.' })


    } catch (error) {
        console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while delete offer. Please try again shortly.' })
    }
}



module.exports = {
    loadOffer,
    editOffer,
    deleteOffer
}