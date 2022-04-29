const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    street: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String,
        maxlength: 2,
        uppercase: true
    },
    zip: {
        type: String,
        maxlength: 5,
        uppercase: true
    },
    cart: [String],
    orders: [String],
    userLevel: {
        type: Number,
        min: 0,
        max: 2,
        default: 1,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', UserSchema);