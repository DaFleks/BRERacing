const express = require('express');
const catchAsync = require('../../utils/CatchAsync');
const Faq = require('../../models/faq');
const ExpressError = require('../../utils/ExpressError');
const {
    faqSchema
} = require('../../utils/JoiSchemas');
const {
    isLoggedIn, isAdmin
} = require('../../utils/middleware');
const router = express.Router();

const validateFaq = (req, res, next) => {
    const {
        error
    } = faqSchema.validate(req.body);

    if (error) {
        throw new ExpressError(error.message, 400);
    } else {
        next();
    }
}

//  ADMIN - FAQS LIST
router.get('/', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const faqs = await Faq.find({});
    res.render('admin/faqs-list', {
        faqs,
        title: 'Admin > FAQs'
    })
}))

//  ADMIN - ADD FAQ
router.get('/new', isLoggedIn, isAdmin, (req, res) => {
    res.render('admin/add-faq');
})

//  ADMIN - ADD FAQ POST
router.post('/', isLoggedIn, isAdmin, validateFaq, catchAsync(async (req, res) => {
    const faq = new Faq({
        title: req.body.title,
        comment: req.body.comment
    })
    await faq.save();
    res.redirect('/admin/faqs');
}))

//  ADMIN - EDIT FAQ
router.get('/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    const faq = await Faq.findOne({
        _id: req.params.id
    })

    res.render('admin/edit-faq', {
        faq
    });
}))

//  ADMIN - EDIT FAQ POST
router.put('/:id', isLoggedIn, isAdmin, validateFaq, catchAsync(async (req, res) => {
    const faq = await Faq.findOne({
        _id: req.params.id
    });

    faq.title = req.body.title;
    faq.comment = req.body.comment;

    await faq.save();
    res.redirect('/admin/faqs');
}))

//  ADMIN - DELETE FAQ
router.delete('/:id', isLoggedIn, isAdmin, catchAsync(async (req, res) => {
    await Faq.findByIdAndDelete(req.params.id);
    res.redirect('/admin/faqs');
}));

module.exports = router;