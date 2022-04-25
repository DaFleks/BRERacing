const express = require('express');
const User = require('../../models/user');
const router = express.Router();

//  ADMIN - GET ALL USERS
router.get('/', async (req, res) => {
    const users = await User.find({});

    res.render('admin/users-list', {
        users
    });
});

//  ADMIN - CREATE NEW USER
router.get('/new', async (req, res) => {
    res.render('admin/add-user');
});

//  ADMIN - CREATE NEW USER POST
router.post('/', async (req, res) => {
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
    res.redirect('/admin/users');
});

//  ADMIN - UPDATE USER
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('admin/edit-user', {
        user
    })
});

//  ADMIN - UPDATE USER POST
router.put('/:id', async (req, res) => {
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
})

//  ADMIN - DELETE USER
router.delete('/:id', async (req, res) => {
    await User.deleteOne({
        _id: req.params.id
    });
    res.redirect('/admin/users');
});

module.exports = router;