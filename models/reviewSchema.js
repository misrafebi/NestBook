const mongoose = require('mongoose')
const { create } = require('./userScehma')
const Product = require('./productSchema')
const { Schema } = mongoose


const reviewSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
    }, 
    review: {
        type: String,
        required: true
    }, 
    createdAt: {
        type: Date,
        default: Date.now,
    },
    replies: [
        {
            reply: { type: String },
            repliedAt: { type: Date, default: Date.now },
        }
    ],

    Product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    email: {
        type: String,
        required: true,
    },
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;