const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    user: {
        // type: Schema.Types.ObjectId,
        // ref: 'User',
        // required: false 
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED'],
        default: 'OPEN'
    }
});

module.exports = mongoose.model('Contact', contactSchema);