const User = require('../../models/user');
const ExpressError = require('../../utils/ExpressError');
const {
    userSchema
} = require('../../utils/JoiSchemas');

//  GET ALL USERS - RENDER
module.exports.index = async (req, res) => {
    const users = await User.find({});
    res.render('admin/users-list', {
        users,
        title: 'Admin > User List'
    });
}

//  ADD NEW USER - RENDER
module.exports.renderAddUser = async (req, res) => {
    //  Render the 'Add New User' Page.
    res.render('admin/add-user', {
        title: 'Admin > Create New User'
    });
}

//  ADD NEW USER
module.exports.addUser = async (req, res) => {
    try {
        //  Create new User object and store properties from form.
        //  Street, City, State, Zip are all optional, if empty, empty string.
        //  If no User Level inputted somehow, defaulted to level 1 (Regular User).
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

        //  Save new User to the database.
        await newUser.save();
    } catch (error) {
        //  Check for error that the email provided is already in the database.
        if (error.code === 11000) {
            throw new ExpressError('An account already exists with that email.', 400);
        } else {
            //  Any other error is simply thrown defautly.
            throw new ExpressError(error, 400);
        }
    }

    //  Redirect to all Users.
    res.redirect('/admin/users');
}

//  UPDATE USER - RENDER
module.exports.renderUpdateUser = async (req, res) => {
    //  Use the ID provided in the params to find the user and store into an object.
    const user = await User.findById(req.params.id);

    //  Render the Update User page with the User object.
    res.render('admin/edit-user', {
        user,
        title: 'Admin > Update User'
    })
}

//  UPDATE USER
module.exports.updateUser = async (req, res) => {
    //  Use the ID provided in the URL params to find the User in the database.
    const user = await User.findOne({
        _id: req.params.id
    });

    //  Update all properties, even unchanged, the unchanged values are in the form body's values.
    user.userLevel = req.body.userLevel;
    user.email = req.body.email;
    user.password = req.body.password;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.street = req.body.street;
    user.city = req.body.city;
    user.state = req.body.state;
    user.zip = req.body.zip;

    //  Save the User to the database & redirect to all Users page.
    await user.save();
    res.redirect('/admin/users');
}

module.exports.deleteUser = async (req, res) => {
    //  Use the ID provided in the URL params to find & delete the User in the database.
    await User.deleteOne({
        _id: req.params.id
    });
    res.redirect('/admin/users');
}

//  USER VALIDATION
module.exports.validate = (req, res, next) => {
    //  If an error exists on validation check, store inside an object.
    const {
        error
    } = userSchema.validate(req.body);

    //  If error exists, throw, else continue.
    if (error) {
        throw new ExpressError(error.message, 400);
    } else {
        next();
    }
}