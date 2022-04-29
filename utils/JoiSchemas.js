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

module.exports.productSchema = Joi.object({
    name: Joi.string().required(),
    sku: Joi.string().required(),
    stock: Joi.number().min(0).required(),
    price: Joi.number().min(0).required(),
    details: Joi.allow(),
    publish: Joi.allow()
})