const express = require('express');
const User = require('../models/user');
const Order = require('../models/order');
const OrderCount = require('../models/orderCount');
const catchAsync = require('../utils/CatchAsync');
const {
    isLoggedIn
} = require('../utils/middleware');
const router = express.Router();
const letters = ['A', 'B', 'C', 'D', ]
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    const userOrders = await User.findOne({
            _id: req.user._id
        })
        .populate('orders', 'orderNumber orderStatus email total trackingNumbers firstName lastName');

    res.render('orders', {
        user: userOrders,
        title: 'Your Orders'
    })
}))

router.post('/', catchAsync(async (req, res) => {
    const newOrderItems = [];
    let letter = '@';

    const count = await OrderCount.findOne();

    const newOrder = new Order({
        orderNumber: count.count + 1,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        street: req.body.street,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        orderItems: newOrderItems,
        orderNotes: req.body.orderNotes,
        subtotal: req.session.cartSubtotal,
        total: (parseFloat(req.session.cartSubtotal) + parseFloat(5.00)).toFixed(2),
        isGuest: req.user ? false : true,
        user: req.user ? req.user._id : null
    })

    req.session.cart.forEach((item) => {
        letter = String.fromCharCode(letter.charCodeAt(0) + 1);
        
        newOrder.orderItems.push({
            lin: `${newOrder.orderNumber}-${letter}`,
            name: item.name,
            sku: item.sku,
            price: item.price,
            quantity: item.quantity
        })
    })

    await newOrder.save();
    count.count++;
    await count.save();

    req.session.cart = null;
    req.session.cartQty = null;
    req.session.cartSubtotal = null;

    if (req.user) {
        const user = await User.findById(req.user._id);
        await user.orders.push(newOrder._id);
        await user.save();
    }

    req.flash('success', 'Order Complete!');
    res.redirect('/')
}))

module.exports = router;