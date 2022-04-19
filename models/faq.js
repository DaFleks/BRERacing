const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dbConnect = require('../dbConnect');

// dbConnect.connect();

const FaqSchema = new Schema({
    title: {
        type: String,
        required: true,
        default: 'Untitled'
    },
    comment: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

const Faq = mongoose.model('Faq', FaqSchema);
module.exports = Faq;

// const faq1 = new Faq({title: 'Faq 2', comment: 'blahblabhalasdqadsadasdasdadadadbah'});
// faq1.save((err) => {
//     if (err) console.log(err);
// });