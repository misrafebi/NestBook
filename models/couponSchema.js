const mongoose = require('mongoose')
const { Schema } = mongoose

const couponSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    createOn: {
        type: Date,
        default: Date.now,

    },
    expireOn: {
        type: Date,
        required: true,
    },
    offerPrice: {
        type: Number,
        required: true,
    },
    minimumPrice: {
        type: Number,
        require: true,
    },
    isListed: {
        type: Boolean,
        default: true,
    },
    userId: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const Coupon = mongoose.Model('Coupon', couponSchema)

module.exports = Coupon;