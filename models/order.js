const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnect = require('../dbConnect');

// dbConnect.connect();

const OrderSchema = new Schema({
    orderNumber: {
        type: Number,
        default: 0,
        unique: true
    },
    orderStatus: {
        type: String,
        emum: ['Processing', 'Shipped', 'Canceled', 'Hold'],
        default: 'Processing',
        required: true
    },
    firstName: {
        type: String,
        default: 'Unknown',
        required: true
    },
    lastName: {
        type: String,
        default: 'Unknown',
        required: true
    },
    email: {
        type: String,
        default: 'No E-Mail',
        required: true
    },
    paymentMethod: {
        type: String,
        default: 'PayPal',
        required: true
    },
    shippingMethod: {
        type: String,
        default: 'USPS',
    },
    street: {
        type: String,
        default: 'No Street',
        required: true
    },
    city: {
        type: String,
        default: 'No City',
        required: true
    },
    state: {
        type: String,
        default: 'No State',
        required: true
    },
    zip: {
        type: String,
        default: 'No Zip',
        required: true
    },
    orderItems: [{
        lin: {
            type: String,
            default: 'No LIN'
        },
        name: {
            type: String,
            required: true,
            default: 'No Name'
        },
        sku: {
            type: String,
            required: true,
            default: 'No SKU'
        },
        price: {
            type: Number,
            required: true,
            min: 0.00,
            default: 0.00
        },
        quantity: {
            type: Number,
            required: true,
            min: 0,
            default: 0
        }
    }],
    orderNotes: {
        type: String,
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    shippingCost: {
        type: Number,
        required: true,
        min: 0.00,
        default: 5.00
    },
    total: {
        type: Number,
        required: true,
        min: 0.00,
        default: 0.00
    },
    trackingNumbers: [String],
    isGuest: {
        type: Boolean,
        default: true,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Order = mongoose.model('Order', OrderSchema);

// const order = new Order({
//     orderNumber: '1000',
//     firstName: 'Alex',
//     lastName: 'Petropoulos',
//     email: 'petropoulosalex@gmail.com',
//     street: '84 Bude Street',
//     city: 'Toronto',
//     state: 'Ontario',
//     zip: 'M6C 1X8',
//     orderItems: [{
//         lin: '1000-A',
//         name: 'Roll Cage [5-Pack]',
//         sku: '1001',
//         price: 32.97,
//         quantity: 3
//     }, {
//         lin: '1000-B',
//         name: 'Roll Cage [10-Pack]',
//         sku: '1002',
//         price: 19.99,
//         quantity: 1
//     }, {
//         lin: '1000-C',
//         name: 'Roll Cage [50-Pack]',
//         sku: '1002',
//         price: 319.96,
//         quantity: 4
//     }],
//     orderNotes: 'Please handle with care, ring doorbell on arrival.',
//     subtotal: 372.92,
//     shippingCost: 10.00,
//     total: 382.92,
//     trackingNumbers: ['123123ADAS', 'FFEAWF1231'],
//     isGuest: false,
//     user: '626ebe665d6f2bd8418be700'
// });

// order.save()
// .then(() => {
// }).catch((e) => {
// })

module.exports = mongoose.model('Order', OrderSchema);