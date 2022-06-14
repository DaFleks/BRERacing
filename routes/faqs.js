const express = require('express');
const catchAsync = require('../utils/CatchAsync');
const {
    getAllFaqs
} = require('../controllers/faqs');
const router = express.Router();

//  FAQS PAGE - RENDER
router.get('/', catchAsync(getAllFaqs))

module.exports = router;