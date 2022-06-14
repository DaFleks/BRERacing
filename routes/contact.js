const express = require('express');
const contacts = require('../controllers/contact');
const router = express.Router();

router.route('/')
//  Get Contact Form
.get(contacts.index)
//  Send Email
.post(contacts.validate, contacts.sendEmail);

module.exports = router;