const express = require('express');
const Order = require('../models/order');
const catchAsync = require('../utils/CatchAsync');
const router = express.Router();

router.get('/:orderid', catchAsync(async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.orderid
    })

    res.render('order', {
        order,
        title: 'Order No. ' + order.orderNumber
    })
}))

module.exports = router;