const express = require('express');
const Product = require('../models/product');
const catchAsync = require('../utils/CatchAsync');
const router = express.Router();

router.post('/', catchAsync(async (req, res) => {
    const {
        productID,
        quantity
    } = req.body;

    const {
        name,
        sku,
        price
    } = await Product.findById(productID);

    req.session.addedItem = {
        name: name,
        sku: sku,
        price: (parseFloat(price) * parseFloat(quantity)).toFixed(2),
        quantity: quantity
    }

    if (req.session.cart) {
        req.session.cart.push(req.session.addedItem);

        req.session.cartQty = req.session.cart.reduce((accumulator, cartItem) => {
            return (parseInt(accumulator) + parseInt(cartItem.quantity));
        }, 0);
    } else {
        req.session.cart = [req.session.addedItem];

        req.session.cartQty = req.session.cart.reduce((accumulator, cartItem) => {
            return (parseInt(accumulator) + parseInt(cartItem.quantity));
        }, 0);
    }

    req.session.cartSubtotal = req.session.cart.reduce((accumulator, cartItem) => {
        return (parseFloat(accumulator) + parseFloat(cartItem.price)).toFixed(2);
    }, 0);
    req.flash('success', 'Added ' + req.session.addedItem.quantity + 'x ' + req.session.addedItem.name + ' to the cart!');
    res.redirect('/');
}))

module.exports = router;