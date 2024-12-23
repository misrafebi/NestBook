const mongoose = require('mongoose');
const { schema } = require('./userSchema');
const {Schema} = mongoose;

const addressSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    address:[{
        addressType:{
            type: String,
            required: true,
        },
        name:{
            type: String,
            required: true,
        },
        mobileNumber:{
            type: Number,
            required: true
        },
        houseAddress: {
            type: String,
            required: true,
        },
        pin: {
            type: Number,
            required: true,
        },
        post:{
            type: String,
            required: true,
        },
        city:{ 
            type: String,
            required: true,
        },
        district:{
            type: String,
            required: true,
        },
        state:{
            type: String,
            required: true,
        }
    }]
})

const Address = mongoose.model('Address', addressSchema)

module.exports = Address;