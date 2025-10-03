const mongoose = require('mongoose')
const { Schema } = mongoose;

const productSchema = new Schema({
    productName: {
        type: String,
        required: true
    },
    authorName: {
        type: String,
    },
    numberPage: {
        type: Number,
    }, 
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    publisher: {
        type: String,
    },
    publishDate: {
        type: Date,
    },
    description: {
        type: String,
    },
    regularPrice: {
        type: Number,
        required: true,
    },
    salePrice: {
        type: Number,
        required: true,
    },
    productOffer: {
        type: Number,
        default: 0,
    },
    startOfferDate:{
        type:Date,
    },
    expireOfferDate:{
        type:Date,
    },
    quantity: {
        type: Number,
    },
    status: {
        type: String,
        enum: ['Available', 'Out Of Stock', 'Disconnected'],
        default: 'Available',
        required: true,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    image: {
        type: [String],
        required: true,
    }, 
    
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema)

module.exports = Product 