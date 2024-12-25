const mongoose = require('mongoose')
const {Schema} = mongoose

const adminSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    
    email:{
        type: String,
        required: true,
        unique: true
    },
    googleId:{
        type: String,
        // unique: true,
        default: null,
    },
    password:{
        type: String,
        required: false,
    },
    isActive:{
        type: Boolean,
        default: true
    },
    isAdmin:{
        type: Boolean,
        default: true,
    },
    
    createdAt:{
        type: Date,
        default: Date.now,
    },
    referalCode:{
        type: String,
    },
    redeemed:{
        type: Boolean,
    },
    redeemedUsers:[{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    couponId: {
        type: Schema.Types.ObjectId,
        ref: 'Coupon', // Assuming a Coupon model exists
    },
    offerId: {
        type: Schema.Types.ObjectId,
        ref: 'Offer', // Assuming an Offer model exists
    },
    searchHistory:[{
        category:{
            type:Schema.Types.ObjectId,
            ref: 'Category',
        },
        searchOn:{
            type:Date,
            default: Date.now
        }
    }]
},{ timestamps: true })


const Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;