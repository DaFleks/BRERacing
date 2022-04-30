const express = require('express');
const catchAsync = require('../utils/CatchAsync');
const {
    ExpressError
} = require('../utils/ExpressError');
const router = express.Router();

router.post('/', catchAsync(async (req, res) => {
    res.send('Hi!');
}))

module.exports = router;