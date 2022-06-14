const express = require('express');
const users = require('../../controllers/admin/users');
const catchAsync = require('../../utils/CatchAsync');
const {
    isLoggedIn,
    isAdmin
} = require('../../utils/middleware');
const router = express.Router();

router.route('/')
//  Get all Users. (TODO: isLoggedIn, isAdmin)
.get(catchAsync(users.index))
//  Add new User.
.post(isLoggedIn, isAdmin, users.validate, catchAsync(users.addUser))

//  Add New User - RENDER
router.get('/new', catchAsync(users.renderAddUser));

router.route('/:id')
//  Get User
.get(catchAsync(users.renderUpdateUser))
//  Update User
.put(isLoggedIn, isAdmin, catchAsync(users.updateUser))
//  Delete User
.delete(isLoggedIn, isAdmin, catchAsync(users.deleteUser))

module.exports = router;