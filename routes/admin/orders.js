const express = require('express');
const Order = require('../../models/order');
const catchAsync = require('../../utils/CatchAsync');
const router = express.Router();

router.get('/', catchAsync(async (req, res) => {
    if (req.query.ordernum) {
        const order = await Order.findOne({
            orderNumber: req.query.ordernum
        })

        if (!order) return res.redirect('/admin/orders');

        return res.render('admin/edit-order', {
            order,
            title: 'Admin > Manage Orders > ' + order.orderNumber
        })
    } else {
        const orders = await Order.find({});

        res.render('admin/order-list', {
            orders,
            title: 'Admin > Manage Orders'
        })
    }

}))

router.patch('/', catchAsync(async(req, res) => {
    const order = await Order.findById(req.body.id);

    if (!order) {
        req.flash('error', 'Something went wrong, notify administrator.');
    } else {
        order.orderStatus = req.body.status;
        order.email = req.body.email;
        order.trackingNumbers = req.body.trackingNumbers.split(', ');
        await order.save();

        req.flash('success', `Order ${order.orderNumber} updated!`);
        res.redirect('/admin/orders');
    }
}))

module.exports = router;