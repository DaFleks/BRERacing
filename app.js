//  DEPENDENCIES
const express = require('express');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Product = require('./models/product');
const dbConnect = require('./dbConnect');
const ExpressError = require('./utils/ExpressError');
const contact = require('./routes/contact');
const faqs = require('./routes/faqs');
const adminFaqs = require('./routes/admin/faqs');
const adminProducts = require('./routes/admin/products');
const adminUsers = require('./routes/admin/users');
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
app.set('view engine', 'ejs');

//  MIDDLEWARE
app.use(express.static('public'));
app.use(express.urlencoded({
    extended: true
}));
app.use(methodOverride('_method'));

//  HOMEPAGE (ALL PRODUCTS LISTED)
app.get('/', async (req, res) => {
    const products = await Product.find({});
    res.render('index', {
        products
    });
});

app.use('/contact', contact);
app.use('/faqs', faqs);
app.use('/admin/faqs', adminFaqs)
app.use('/admin/products', adminProducts);
app.use('/admin/users', adminUsers);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})

// ERROR ROUTE
app.use((err, req, res, next) => {
    const {
        statusCode = 500
    } = err;
    console.dir(err);
    if (!err.message) err.message = 'Oops! Something went wrong!';

    res.status(statusCode).render('error', {
        err
    });
})

//  SERVER LISTEN
app.listen(HTTP_PORT, () => {
    console.log(`BRERacing Express Server Now Listening On Port: ${HTTP_PORT}`);
});