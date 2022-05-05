const ExpressError = require('../utils/ExpressError');

module.exports.validateUser = (schema, req, res, next) => {
    const {
        error
    } = schema.validate(req.body);

    if (error) {
        throw new ExpressError(error.message, 400);
    } else {
        next();
    }
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in to view this page.');
        return res.redirect('/');
    } else {
        next();
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (req.user.userLevel === 2) {
        next();
    } else {
        throw new ExpressError('Page Not Found', 404);
    }
}