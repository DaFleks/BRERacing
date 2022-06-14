const express = require('express');
const orders = require('../../controllers/admin/orders');
const catchAsync = require('../../utils/CatchAsync');
const router = express.Router();

router.route('/')
//  Render all orders.
.get(catchAsync(orders.index))
//  Quick update the status, email, or tracking numbers.
.patch(catchAsync(orders.quickPatch))

module.exports = router;