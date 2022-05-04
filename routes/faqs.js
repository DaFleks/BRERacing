const express = require('express');
const Faq = require('../models/faq');
const catchAsync = require('../utils/CatchAsync');
const router = express.Router();

//  FAQS PAGE
router.get('/', catchAsync(async (req, res) => {
    const faqs = await Faq.find({});
    res.render('faqs', {
        faqs,
        title: 'FAQs'
    })
}))

module.exports = router;