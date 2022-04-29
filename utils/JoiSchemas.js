const Joi = require('joi');

module.exports.contactSchema = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2
    }).required(),
    subject: Joi.string().required(),
    message: Joi.string().required()
}).required()

module.exports.faqSchema = Joi.object({
    title: Joi.string().required(),
    comment: Joi.string().required()
}).required()