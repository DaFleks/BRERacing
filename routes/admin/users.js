const express = require('express');
const User = require('../../models/user');
const catchAsync = require('../../utils/CatchAsync');
const ExpressError = require('../../utils/ExpressError');
const {
    userSchema
} = require('../../utils/JoiSchemas');
const {
    isLoggedIn,
    isAdmin
} = require('../../utils/middleware');
const router = express.Router();

const validateUser = (req, res, next) => {
    const {
        error
    } = userSchema.validate(req.body);

    if (error) {
        throw new ExpressError(error.message, 400);
    } else {
        next();
    }
}

//  ADMIN - GET ALL USERS
router.get('/', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const users = await User.find({});
    res.render('admin/users-list', {
        users
    });
}));

//  ADMIN - CREATE NEW USER
router.get('/new', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    res.render('admin/add-user');
}));

//  ADMIN - CREATE NEW USER POST
router.post('/', isLoggedIn, isAdmin, validateUser, catchAsync(async (req, res) => {
    try {
        const newUser = new User({
            email: req.body.email,
            password: req.body.password,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            street: req.body.street != undefined ? req.body.street : '',
            city: req.body.city != undefined ? req.body.city : '',
            state: req.body.state != undefined ? req.body.state : '',
            zip: req.body.zip != undefined ? req.body.zip : '',
            userLevel: req.body.userLevel != undefined ? req.body.userLevel : 1
        });
        await newUser.save();
    } catch (error) {
        if (error.code === 11000) {
            throw new ExpressError('An account already exists with that email.', 400);
        } else {
            throw new ExpressError(error, 400);
        }
    }
    res.redirect('/admin/users');
}));

//  ADMIN - UPDATE USER
router.get('/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('admin/edit-user', {
        user
    })
}));

//  ADMIN - UPDATE USER POST
router.put('/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const user = await User.findOne({
        _id: req.params.id
    });
    user.userLevel = req.body.userLevel;
    user.email = req.body.email;
    user.password = req.body.password;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.street = req.body.street;
    user.city = req.body.city;
    user.state = req.body.state;
    user.zip = req.body.zip;
    await user.save();
    res.redirect('/admin/users');
}))

//  ADMIN - DELETE USER
router.delete('/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    await User.deleteOne({
        _id: req.params.id
    });
    res.redirect('/admin/users');
}));

module.exports = router;