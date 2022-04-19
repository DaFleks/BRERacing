//  DEPENDENCIES
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const fs = require('fs');
const multer = require('multer');
const short = require('short-uuid');
const Product = require('./models/product');
const User = require('./models/user');
const Faq = require('./models/faq');
const dbConnect = require('./dbConnect');
const nodemailer = require('nodemailer');
require('dotenv').config({
    path: './vars.env'
});

//  DB CONNECT
dbConnect.connect();

//  UTILTIES
const app = express();
const HTTP_PORT = process.env.port || 3000;
const db = mongoose.connection;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/temp');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}__${short.generate()}${path.extname(file.originalname)}`);
    }
})
const upload = multer({
    storage: storage
});

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

//  PRODUCT PAGE
app.get('/products/:id', async (req, res) => {
    const product = await Product.findOne({
        _id: req.params.id
    });
    res.render('product', {
        product
    });
});

//  CONTACT PAGE
app.get('/contact', (req, res) => {
    res.render('contact', {
        emailSent: false,
        err: false
    });
});

app.post('/contact', (req, res) => {
    const mail = {
        from: req.body.email,
        to: process.env.EMAIL,
        subject: req.body.subject,
        text: `From: ${req.body.email}\n\n${req.body.message}`
    }
    const transporter = nodemailer.createTransport({
        service: "Gmail",
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        },
    });

    // transporter.verify((err, success) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('success');
    //     }
    // });

    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.render('contact', {
                emailSent: true,
                err: true
            });
        } else {
            res.render('contact', {
                emailSent: true,
                err: false
            });
        }
    });
});

//  FAQS PAGE
app.get('/faqs', async (req, res) => {
    const faqs = await Faq.find({});
    res.render('faqs', {
        faqs
    })
})

//  ADMIN - FAQS LIST
app.get('/admin/faqs', async (req, res) => {
    const faqs = await Faq.find({});
    res.render('admin/faqs-list', {
        faqs
    })
})

//  ADMIN - ADD FAQ
app.get('/admin/faqs/new', (req, res) => {
    res.render('admin/add-faq');
})

//  ADMIN - ADD FAQ POST
app.post('/admin/faqs/', async (req, res) => {
    const faq = new Faq({
        title: req.body.title,
        comment: req.body.comment
    })
    await faq.save();
    res.redirect('/admin/faqs');
})

//  ADMIN - EDIT FAQ
app.get('/admin/faqs/:id', async (req, res) => {
    const faq = await Faq.findOne({
        _id: req.params.id
    })

    res.render('admin/edit-faq', {
        faq
    });
})

//  ADMIN - EDIT FAQ POST
app.put('/admin/faqs/:id', async (req, res) => {
    const faq = await Faq.findOne({
        _id: req.params.id
    });

    faq.title = req.body.title;
    faq.comment = req.body.comment;

    await faq.save();
    res.redirect('/admin/faqs');
})

//  ADMIN - DELETE FAQ
app.delete('/admin/faqs/:id', async (req, res) => {
    await Faq.findByIdAndDelete(req.params.id);
    res.redirect('/admin/faqs');
})

//  ADMIN - PRODUCT LIST
app.get('/admin/products', async (req, res) => {
    const products = await Product.find({});
    res.render('admin/product-list', {
        products
    });
});

//  ADMIN - ADD PRODUCT
app.get('/admin/products/add', (req, res) => {
    res.render('admin/add-product');
})

//  ADMIN - ADD PRODUCT POST
app.post('/admin/products/', upload.single('image'), async (req, res) => {
    const product = new Product({
        name: req.body.productName,
        image: '',
        sku: req.body.sku,
        stock: req.body.stock,
        price: req.body.price,
        details: [''],
        published: req.body.publish === 'true' ? true : false
    })

    fs.mkdirSync('./public/images/products/' + product._id);
    let newFilename = product._id + '__' + req.file.filename;
    let oldPath = './public/images/temp/' + req.file.filename;
    let newPath = './public/images/products/' + product._id + '/' + newFilename;
    fs.rename(oldPath, newPath, (err) => {
        if (err) console.log(err);
    });

    product.image = newFilename;
    await product.save();
    res.redirect('/admin/products');
});

//  ADMIN - UPDATE PRODUCT
app.get('/admin/products/:id', async (req, res) => {
    const product = await Product.findOne({
        _id: req.params.id
    });
    res.render('admin/edit-product', {
        product
    })
});

//  ADMIN - UPDATE PRODUCT POST
app.put('/admin/products/:id', upload.single('image'), async (req, res) => {
    const product = await Product.findOne({
        _id: req.params.id
    })

    if (req.file) {
        fs.rm('./public/images/products/' + req.params.id + '/' + product.image, (err) => {
            if (err) {
                console.log(err);
            }
        });
        let newFilename = product._id + '__' + req.file.filename;
        let oldPath = './public/images/temp/' + req.file.filename;
        let newPath = './public/images/products/' + product._id + '/' + newFilename;
        fs.rename(oldPath, newPath, (err) => {
            if (err) console.log(err);
        });
        product.image = newFilename;
    }

    product.name = req.body.name;
    product.sku = req.body.sku;
    product.stock = req.body.stock;
    product.price = req.body.price;
    product.published = req.body.publish === 'true' ? true : false

    await product.save();
    res.redirect('/admin/products');
})

//  ADMIN - DELETE PRODUCT
app.delete('/admin/products/:id', async (req, res) => {
    fs.rm('./public/images/products/' + req.params.id, {
        recursive: true
    }, (err) => {
        if (err) {
            console.log(err);
        }
    });
    await Product.deleteOne({
        _id: req.params.id
    });
    res.redirect('/admin/products');
});

//  ADMIN - GET ALL USERS
app.get('/admin/users', async (req, res) => {
    const users = await User.find({});

    res.render('admin/users-list', {
        users
    });
});

//  ADMIN - CREATE NEW USER
app.get('/admin/users/new', async (req, res) => {
    res.render('admin/add-user');
});

//  ADMIN - CREATE NEW USER POST
app.post('/admin/users', async (req, res) => {
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
app.get('/admin/users/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    res.render('admin/edit-user', {
        user
    })
});

//  ADMIN - UPDATE USER POST
app.put('/admin/users/:id', async (req, res) => {
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
app.delete('/admin/users/:id', async (req, res) => {
    await User.deleteOne({
        _id: req.params.id
    });
    res.redirect('/admin/users');
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

//  SERVER LISTEN
app.listen(HTTP_PORT, () => {
    console.log(`BRERacing Express Server Now Listening On Port: ${HTTP_PORT}`);
});