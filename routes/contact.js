const express = require('express');
const nodemailer = require('nodemailer');
const ExpressError = require('../utils/ExpressError')
const {
    contactSchema
} = require('../utils/JoiSchemas');
const router = express.Router();
require('dotenv').config({
    path: './vars.env'
});

const validateContact = (req, res, next) => {
    const {
        error
    } = contactSchema.validate(req.body);

    if (error) {
        throw new ExpressError(error.message, 400);
    } else {
        next();
    }
}

//  CONTACT PAGE
router.get('/', (req, res) => {
    res.render('contact', {
        emailSent: false,
        err: false
    });
});

// CONTACT POST
router.post('/', validateContact, (req, res) => {
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

module.exports = router;