const Joi = require('joi');
const {
    joiPassword
} = require('joi-password');

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
    details: Joi.string(),
    publish: Joi.boolean(),
    discountActive: Joi.boolean(),
    discountAmount: Joi.number().min(0),
    details: Joi.string().allow('')
})

module.exports.userSchema = Joi.object({
    userLevel: Joi.number()
        .min(0)
        .max(2)
        .required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2
        }).required(),
    password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .required(),
    password2: Joi.string()
        .valid(Joi.ref('password'))
        .required(),
    firstName: Joi.string()
        .required(),
    lastName: Joi.string()
        .required(),
        street: Joi.string().allow(''),
        city: Joi.string().allow(''),
        state: Joi.string().allow(''),
        zip: Joi.string().allow('')
})

module.exports.registerSchema = Joi.object({
    userLevel: Joi.number()
    .min(1)
    .max(1),
email: Joi.string()
    .email({
        minDomainSegments: 2
    }).required(),
password: joiPassword
    .string()
    .minOfSpecialCharacters(1)
    .minOfLowercase(1)
    .minOfUppercase(1)
    .minOfNumeric(1)
    .noWhiteSpaces()
    .required(),
password2: Joi.string()
    .valid(Joi.ref('password'))
    .required(),
firstName: Joi.string()
    .required(),
lastName: Joi.string()
    .required(),
street: Joi.string().allow(''),
city: Joi.string().allow(''),
state: Joi.string().allow(''),
zip: Joi.string().allow('')
})