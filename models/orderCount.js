const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {
    connect
} = require('../dbConnect');

// connect();

const OrderCountSchema = new Schema({
    count: {
        type: Number,
        default: 124874
    }
});

const OrderCount = mongoose.model('OrderCount', OrderCountSchema);
module.exports = OrderCount;

// const newCount = new OrderCount({});

// newCount.save()
// .then(() => {
//     console.log('done!');
// });