const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true, 
    },  
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
        required: false,
        sparse: true,
        default: null,
    },
    googleId: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
    },
    password: {
        type: String,
        required: false,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false, 
    },
    cart: [{
        type: Schema.Types.ObjectId,
        ref: 'Cart'
    }],
    wishlist: [{
        type: Schema.Types.ObjectId,
        ref: 'Whishlist'
    }],
    wallet: {
        type: Number,
        default: 0,
    },
    createOn: {
        type: Date,
        default: Date.now,
    },
    orderHistory: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    referelCode: {
        type: String,
    },
    redeemed: {
        type: Boolean,
    },
    redeemedUsers: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    searchHistory: [{
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
        },
        searchOn: {
            type: Date,
            default: Date.now
        }
    }],
})

const User = mongoose.model('User',userSchema)

module.exports = User