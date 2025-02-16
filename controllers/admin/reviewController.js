const { findById } = require('../../models/categorySchema');
const Review = require('../../models/reviewSchema')

const loadReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 })

        res.render('admin/review', { reviews })
    } catch (error) {
        console.error(error);
    }
}

const loadReplay = async (req, res) => {
    try {
        console.log('........');
        
        const id = req.params.id
        console.log('req.params.id:',req.params.id);
        console.log('id:',id);
        
        
        const review = await Review.findById(id)
        res.render('admin/replay', review)
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    loadReviews,
    loadReplay
}