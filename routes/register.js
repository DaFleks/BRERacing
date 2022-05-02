const express = require('express');
const catchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const {
    registerSchema
} = require('../utils/JoiSchemas');
const User = require('../models/user');
const router = express.Router();

const validateUser = (req, res, next) => {
    const {
        error
    } = registerSchema.validate(req.body);

    if (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    } else {
        next();
    }
}

router.get('/', (req, res) => {
    res.render('register');
})

router.post('/', validateUser, catchAsync(async (req, res) => {
    try {
        const {
            password
        } = req.body;

        const newUser = new User({
            userLevel: 1,
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            street: req.body.street != undefined ? req.body.street : '',
            city: req.body.city != undefined ? req.body.city : '',
            state: req.body.state != undefined ? req.body.state : '',
            zip: req.body.zip != undefined ? req.body.zip : ''
        })

        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, err => {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/');
            }
        })

    } catch (error) {
        req.flash('error', error.message);
        return res.redirect('/');
    }
    req.flash('success', 'Hi ' + req.user.firstName + '! You are now signed in!');
    res.redirect('/');
}))

module.exports = router;