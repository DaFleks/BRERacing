const express = require('express');
const catchAsync = require('../../utils/CatchAsync');
const Faq = require('../../models/faq');
const router = express.Router();

//  ADMIN - FAQS LIST
router.get('/', catchAsync(async (req, res) => {
    const faqs = await Faq.find({});
    res.render('admin/faqs-list', {
        faqs
    })
}))

//  ADMIN - ADD FAQ
router.get('/new', (req, res) => {
    res.render('admin/add-faq');
})

//  ADMIN - ADD FAQ POST
router.post('/', catchAsync(async (req, res) => {
    const faq = new Faq({
        title: req.body.title,
        comment: req.body.comment
    })
    await faq.save();
    res.redirect('/admin/faqs');
}))

//  ADMIN - EDIT FAQ
router.get('/:id', async (req, res) => {
    const faq = await Faq.findOne({
        _id: req.params.id
    })

    res.render('admin/edit-faq', {
        faq
    });
})

//  ADMIN - EDIT FAQ POST
router.put('/:id', async (req, res) => {
    const faq = await Faq.findOne({
        _id: req.params.id
    });

    faq.title = req.body.title;
    faq.comment = req.body.comment;

    await faq.save();
    res.redirect('/admin/faqs');
})

//  ADMIN - DELETE FAQ
router.delete('/:id', async (req, res) => {
    await Faq.findByIdAndDelete(req.params.id);
    res.redirect('/admin/faqs');
})

module.exports = router;