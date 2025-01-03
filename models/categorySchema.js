const mongoose = require('mongoose')

const {Schema} = mongoose;

const categorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        
    },
    isListed: {
        type: Boolean,
        default: true
    },
    categoryOffer:{
        type: Number,
        default: 0
    },
    creatAt:{
        type: Date,
        default: Date.now
    },
    parentCategory:{
        type: String,
    }
})

const Category = mongoose.model('Category',categorySchema)

module.exports = Category;