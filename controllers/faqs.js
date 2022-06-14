const Faq = require('../models/faq');

module.exports.getAllFaqs = async (req, res) => {
    //  Find all FAQs in database.
    const faqs = await Faq.find({});

    //  If there are no FAQs in the DB, flash an error message.
    if (!faqs) req.flash('warning', 'No FAQs stored!');
    
    //  Render the page regardless.
    res.render('faqs', {
        faqs,
        title: 'FAQs'
    })
}