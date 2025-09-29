const mongoose=require('mongoose')
const { findById } = require('../../models/categorySchema');
const Review = require('../../models/reviewSchema')

const loadReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 })

        res.render('admin/review', { reviews, message: '' })
    } catch (error) {
       console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while load review page. Please try again shortly.' })
    }
}

const loadReply = async (req, res) => {
    try {


        const id = req.params.id
        if (!id) {
            return res.render('admin/reply', {
                review,
                formattedDate: review.createdAt.toLocaleDateString('en-GB'),
                validRating: review.rating,
                message: 'ID not found'
            })
        }
        const review = await Review.findById(id)
        if (!review) {
            return res.render('admin/review', {
                message: 'Review not found',
                reviews: await Review.find({})
            })
        }

        // const formattedDate = review.createdAt.toLocaleDateString('en-GB');
        // const validRating = review.rating

        return res.render('admin/reply', {
            review,
            formattedDate: review.createdAt.toLocaleDateString('en-GB'),
            validRating: review.rating,
            id,
            message: ''
        })
    } catch (error) {
       console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while load review replay page. Please try again shortly.' })
    }
}
const postReply = async (req, res) => {
    try {

        const id = req.params.id
        if (!id) {
            return res.render('admin/reply', {
                review,
                formattedDate: review.createdAt.toLocaleDateString('en-GB'),
                validRating: review.rating,
                message: 'ID not found'
            })
        }
        const review = await Review.findById(id)
        if (!review) {
            return res.render('admin/review', {
                message: 'Review not found',
                reviews: await Review.find({})
            })
        }
        // const formattedDate = review.createdAt.toLocaleDateString('en-GB');
        // const validRating = review.rating
        const { reply } = req.body
        if (!reply) {
            return res.render('admin/reply', {
                review,
                formattedDate: review.createdAt.toLocaleDateString('en-GB'),
                validRating: review.rating,
                message: 'Reply can not be empty'
            })
        }

        review.replies = review.replies || []
        review.replies.push({ _id: new mongoose.Types.ObjectId(), text: reply })
        await review.save()


        res.render('admin/review', {
            reviews: await Review.find({}),
            message: 'Replay sended successfully'
        })
    } catch (error) {
        console.log('Error', error);
        res.json({ success: false, message: 'Something went wrong while send replay. Please try again shortly.' })
    }
}

module.exports = {
    loadReviews,
    loadReply,
    postReply
}