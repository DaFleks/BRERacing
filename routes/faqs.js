const express = require('express');
const Faq = require('../models/faq');
const catchAsync = require('../utils/CatchAsync');
const router = express.Router();

//  FAQS PAGE
router.get('/', catchAsync(async (req, res) => {
    const faqs = await Faq.find({});

    if (!faqs) req.flash('warning', 'No FAQs stored!');

    res.render('faqs', {
        faqs,
        title: 'FAQs'
    })
}))

module.exports = router;