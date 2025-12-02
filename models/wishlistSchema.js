const mongoose = require('mongoose')
const { Schema } = mongoose

// const wishlistShema = new Schema({
//     userId: {
//         type: Schema.Types.ObjectId,
//         ref: 'User', 
//         required: true,
//     },

//     products: [{
//         productId: { 
//             type: Schema.Types.ObjectId,
//             ref: 'Product',
//             required: true,
//         },
//         addedOn: {
//             type: Date,
//             default: Date.now
//         },
//     }]
// })

const wishlistShema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    items: [{  // Changed from 'products' to 'items' to match your controller
        ProductId: { 
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        addedOn: {
            type: Date,
            default: Date.now
        },
    }]
}, { timestamps: true });

const Wishlist = mongoose.model('Wishlist', wishlistShema)

module.exports = Wishlist