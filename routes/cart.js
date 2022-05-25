const express = require('express');
const Product = require('../models/product');
const catchAsync = require('../utils/CatchAsync');
const router = express.Router();

router.post('/emptycart', catchAsync(async (req, res, next) => {
    req.session.cart = [];
    req.session.cartQty = 0;
    req.session.cartSubtotal = 0.00;
    next();
}))

router.post('/', catchAsync(async (req, res, next) => {
    const {
        productID,
        quantity
    } = req.body;

    const product = await Product.findById(productID);
    let price = product.isDiscounted === true ? product.discountedPrice : product.price;

    const newItem = {
        id: product._id,
        name: product.name,
        sku: product.sku,
        price: (parseFloat(price) * parseFloat(quantity)).toFixed(2),
        quantity: quantity
    }

    if (req.session.cart) {
        let itemExists = false;
        let index = 0;

        for (let i = 0; i < req.session.cart.length; i++) {
            if (req.session.cart[i].id == product._id) {
                itemExists = true;
                index = i;
                break;
            }
        }

        if (!itemExists) {
            req.session.cart.push(newItem);

            req.session.cartQty = req.session.cart.reduce((accumulator, cartItem) => {
                return (parseInt(accumulator) + parseInt(cartItem.quantity));
            }, 0);
        } else {
            //  DEFINITELY A BETTER WAY TO DO THIS
            req.session.cart[index].quantity = parseInt(req.session.cart[index].quantity) + parseInt(newItem.quantity);
            req.session.cart[index].price = parseFloat(req.session.cart[index].price) + parseFloat(newItem.price);
        }
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
    if (req.session.cartSubtotal === undefined) req.session.cartSubtotal = 0.00.toFixed(2);

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