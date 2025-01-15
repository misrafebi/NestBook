const mongoose = require('mongoose')
const Product = require('./productSchema')
const { Schema } = mongoose

const cartShema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        ProductId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        price: {
            type: Number,
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: 'Placed'
        },
        cancelationReason: {
            type: String,
            default: 'none'
        }
    }]
})

const Cart = mongoose.model('Cart', cartShema)
module.exports = Cart