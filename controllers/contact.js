const nodemailer = require('nodemailer');
const ExpressError = require('../utils/ExpressError');
const {
    contactSchema
} = require('../utils/JoiSchemas');
require('dotenv').config({
    path: './.env'
});

//  CONTACT PAGE - RENDER
module.exports.index = (req, res) => {
    res.render('contact', {
        emailSent: false,
        err: false
    });
}

//  SEND EMAIL
module.exports.sendEmail = (req, res) => {
    //  Create Mail object.
    const mail = {
        //  Customer's email
        from: req.body.email,
        //  BRERacing's email
        to: process.env.EMAIL,
        //  Subject of the email
        subject: req.body.subject,
        //  Email Body Formatted
        text: `From: ${req.body.email}\n\n${req.body.message}`
    }

    //  Transporter object detailing send functionality
    const transporter = nodemailer.createTransport({
        //  Service & Credentials
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

    //  Calling send functionality on the transporter.
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            //  If there was an error, 
            return res.render('contact', {
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
}


//  CONTACT VALIDATE
module.exports.validate = (req, res, next) => {
    //  If there's an error on validation, store into object.
    const {
        error
    } = contactSchema.validate(req.body);

    //  If there's an error throw, otherwise continue.
    if (error) {
        throw new ExpressError(error.message, 400);
    } else {
        next();
    }
}