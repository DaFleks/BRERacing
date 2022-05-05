//  DEPENDENCIES
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Product = require('./models/product');
const dbConnect = require('./dbConnect');
const ExpressError = require('./utils/ExpressError');

//  ROUTES
const contactRoutes = require('./routes/contact');
const faqsRoutes = require('./routes/faqs');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const adminFaqsRoutes = require('./routes/admin/faqs');
const adminProductsRoutes = require('./routes/admin/products');
const adminUsersRoutes = require('./routes/admin/users');
const adminOrdersRoutes = require('./routes/admin/orders');
const cart = require('./routes/cart');
const checkout = require('./routes/checkout');
const orders = require('./routes/orders');
const order = require('./routes/order');

//  VARS
require('dotenv').config({
    path: './vars.env'
});

//  DB CONNECT
dbConnect.connect();

//  UTILTIES
const app = express();
const HTTP_PORT = process.env.port || 3000;
const db = mongoose.connection;

//  VIEW ENGINE
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

//  MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}))
app.use(flash());
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({
    usernameField: 'email'
}, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.warning = req.flash('warning');
    res.locals.currentUser = req.user;
    res.locals.cartQty = req.session.cartQty || 0;
    res.locals.cart = req.session.cart;
    res.locals.cartSubtotal = req.session.cartSubtotal || 0.00;
    next();
})

//  HOMEPAGE (ALL PRODUCTS LISTED)
app.get('/', async (req, res) => {
    const products = await Product.find({});

    if (!products) req.flash('warning', 'No Products Available As Of Yet.');
    
    res.render('index', {
        products, 
        title: 'Slot Car Parts'
    });
});

app.use('/contact', contactRoutes);
app.use('/faqs', faqsRoutes);
app.use('/register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/admin/faqs', adminFaqsRoutes);
app.use('/admin/products', adminProductsRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/admin/orders', adminOrdersRoutes);
app.use('/cart', cart);
app.use('/checkout', checkout);
app.use('/orders', orders);
app.use('/order', order);

app.get('/logout', (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You were not signed in to begin with.');
        return res.redirect('/');
    }

    req.logout();
    req.flash('success', 'You have been signed out.');
    res.redirect('/');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// ERROR ROUTE
app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;

    if (!err.message) err.message = 'Oops! Something went wrong!';

    res.status(statusCode).render('error', {
        err
    });
})

//  SERVER LISTEN
app.listen(HTTP_PORT, () => {
    console.log(`BRERacing Express Server Now Listening On Port: ${HTTP_PORT}`);
});