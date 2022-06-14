const express = require('express');
const catchAsync = require('../../utils/CatchAsync');
const faqs = require('../../controllers/faqs');
const {
    isLoggedIn, isAdmin
} = require('../../utils/middleware');
const router = express.Router();

router.route('/')
//  Render All FAQs.
.get(isLoggedIn, isAdmin, catchAsync(faqs.index))
//  Add New FAQ.
.post(isLoggedIn, isAdmin, faqs.validateFaq, catchAsync(faqs.addFaq))

//  Render New FAQ Form.
router.get('/new', isLoggedIn, isAdmin, faqs.renderAddFaq);

router.route('/:id')
//  Render Single FAQ.
.get(isLoggedIn, isAdmin, catchAsync(faqs.renderEditFaq))
//  Update Single FAQ.
.put(isLoggedIn, isAdmin, faqs.validateFaq, catchAsync(faqs.editFaq))
//  Delete FAQ.
.delete(isLoggedIn, isAdmin, catchAsync(faqs.deleteFaq));

module.exports = router;