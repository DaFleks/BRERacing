const express = require('express');
const Product = require('../models/product');
const catchAsync = require('../utils/CatchAsync');
const router = express.Router();

router.post('/', catchAsync(async (req, res, next) => {
    const {
        productID,
        quantity
    } = req.body;

    const product = await Product.findById(productID);
    let price = product.isDiscounted === true ? product.discountedPrice : product.price;

    const newItem = {
        name: product.name,
        sku: product.sku,
        price: (parseFloat(price) * parseFloat(quantity)).toFixed(2),
        quantity: quantity
    }

    if (req.session.cart) {
        req.session.cart.push(newItem);

        req.session.cartQty = req.session.cart.reduce((accumulator, cartItem) => {
            return (parseInt(accumulator) + parseInt(cartItem.quantity));
        }, 0);
    } else {
        req.session.cart = [newItem];

        req.session.cartQty = req.session.cart.reduce((accumulator, cartItem) => {
            return (parseInt(accumulator) + parseInt(cartItem.quantity));
        }, 0);
    }

    req.session.cartSubtotal = req.session.cart.reduce((accumulator, cartItem) => {
        return (parseFloat(accumulator) + parseFloat(cartItem.price)).toFixed(2);
    }, 0);

    next();
}))

router.get('/cartdata', catchAsync(async (req, res) => {
    res.json({
        cart: req.session.cart,
        subtotal: req.session.cartSubtotal
    });
}))

router.get('/cartqty', catchAsync(async (req, res, next) => {
    res.json({
        cartQty: req.session.cartQty
    });
}))

module.exports = router;