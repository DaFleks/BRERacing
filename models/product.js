const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    sku: {
        type: String,
        required: true,
        unique: true,
    },
    stock: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0.00,
        min: 0.00
    },
    details: {
        type: String,
    },
    published: {
        type: Boolean,
        default: false
    },
    isDiscounted: {
        type: Boolean,
        default: false
    },
    discountAmount: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    discountedPrice: {
        type: Number,
        min: 0,
        default: 0
    } 
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', ProductSchema);