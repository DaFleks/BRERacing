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
        throw new ExpressError(error.message, 400);
    } else {
        next();
    }
}

router.get('/', (req, res) => {
    res.render('register');
})

router.post('/', validateUser, catchAsync(async (req, res) => {
    try {
        const newUser = new User({
            userLevel: 1,
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            street: req.body.street != undefined ? req.body.street : '',
            city: req.body.city != undefined ? req.body.city : '',
            state: req.body.state != undefined ? req.body.state : '',
            zip: req.body.zip != undefined ? req.body.zip : ''
        })
        await newUser.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new ExpressError('An account already exists with that email.', 400);
        } else {
            throw new ExpressError(error, 400);
        }
    }
    res.redirect('/');
}))

module.exports = router;