const express = require('express');
const catchAsync = require('../utils/CatchAsync');
const {
    ExpressError
} = require('../utils/ExpressError');
const passport = require('passport');
const router = express.Router();

router.post('/', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/'
}), catchAsync(async (req, res) => {
    req.flash('success', 'Welcome Back!');
    res.redirect('/');
}))

module.exports = router;