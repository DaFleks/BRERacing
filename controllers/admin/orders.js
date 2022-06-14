const Order = require('../../models/order');

//  GET ALL ORDERS - RENDER
module.exports.index = async (req, res) => {
    //  If there is an order number query in the URL string, use it  
    //  to find the order in the database and store into an object.
    if (req.query.ordernum) {
        const order = await Order.findOne({
            orderNumber: req.query.ordernum
        })

        //  If an order wasn't found using the query, redirect to
        //  all orders. Return used to kill any further execution in the flow.
        if (!order) return res.redirect('/admin/orders');

        //  If an order was found, render it with the appropriate title passed.
        //  Return used to kill any possible further execution in the flow.
        return res.render('admin/edit-order', {
            order,
            title: 'Admin > Manage Orders > ' + order.orderNumber
        })
    } else {
        //  If there is no query in the URL string, find all orders
        //  and store them into an object.
        const orders = await Order.find({});

        //  Render all orders with the appropriate title.
        //  Return wasn't used here as there is no further code to flow through.
        res.render('admin/order-list', {
            orders,
            title: 'Admin > Manage Orders'
        })
    }
}

//  UPDATE - ONLY STATUS, EMAIL & TRACKING NUMBERS
module.exports.quickPatch = async(req, res) => {
    //  Find the ID using the hidden input on the form.
    const order = await Order.findById(req.body.id);

    //  If no order is found, flash the error.
    if (!order) {
        req.flash('error', 'Something went wrong, notify administrator.');
    } else {
        //  Update the order object and save to the database.
        //  Updating all properties as any previous data is already inserted into the values of the form.
        order.orderStatus = req.body.status;
        order.email = req.body.email;
        order.trackingNumbers = req.body.trackingNumbers.split(', ');
        await order.save();

        //  Flash a success message & redirect to all orders page.
        req.flash('success', `Order ${order.orderNumber} updated!`);
        res.redirect('/admin/orders');
    }
}