const Faq = require('../../models/faq');
const {
    faqSchema
} = require('../../utils/JoiSchemas');
const ExpressError = require('../../utils/ExpressError');

//  GET ALL FAQS - RENDER
module.exports.index = async (req, res) => {
    //  Store all FAQs query inside an object.
    const faqs = await Faq.find({});

    //  Render the FAQs with the appropriate title.
    res.render('admin/faqs-list', {
        faqs,
        title: 'Admin > FAQs'
    })
}

//  ADD NEW FAQ - RENDER
module.exports.renderAddFaq = (req, res) => {
    //  Render the Add FAQ form.
    res.render('admin/add-faq');
}

//  ADD NEW FAQ
module.exports.addFaq = async (req, res) => {
    //  Get the title & comment from the form and store in an object.
    const faq = new Faq({
        title: req.body.title,
        comment: req.body.comment
    })

    //  Save into the database.
    await faq.save();

    //  Redirect to the index page.
    res.redirect('/admin/faqs');
}

//  EDIT FAQ - RENDER
module.exports.renderEditFaq = async (req, res) => {
    //  Find the FAQ in the database using the ID in the params & store into an object.
    const faq = await Faq.findOne({
        _id: req.params.id
    })

    //  Render the edit page using the FAQ object.
    res.render('admin/edit-faq', {
        faq
    });
}

//  EDIT FAQ
module.exports.editFaq = async (req, res) => {
    //  Find the FAQ in the database using the ID in the params & store into an object.
    const faq = await Faq.findOne({
        _id: req.params.id
    });

    //  Set the properties of the FAQ based on the values of the form.
    //  Even though all properties are being 'changed', any unchanged values was printed in the form automatically.
    faq.title = req.body.title;
    faq.comment = req.body.comment;

    //  Save the changes to the databse.
    await faq.save();

    //  Redirect to FAQ page.
    res.redirect('/admin/faqs');
}

module.exports.deleteFaq = async (req, res) => {
    //  Find & Delete FAQ directly in the database using the ID in the params.
    await Faq.findByIdAndDelete(req.params.id);

    //  Redirect to FAQ page.
    res.redirect('/admin/faqs');
}

module.exports.validateFaq = (req, res, next) => {
    //  If any errors are present during validation, store it into an object.
    const {
        error
    } = faqSchema.validate(req.body);

    //  If there's an error throw, otherwise continue with the request.
    if (error) {
        throw new ExpressError(error.message, 400);
    } else {
        next();
    }
}