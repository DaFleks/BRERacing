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
    },
    published: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Faq = mongoose.model('Faq', FaqSchema);
module.exports = Faq;

// const faq1 = new Faq({
//     title: 'Faq 2',
//     comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Urna condimentum mattis pellentesque id nibh tortor id aliquet. Aliquam eleifend mi in nulla posuere. Laoreet non curabitur gravida arcu ac tortor. Ridiculus mus mauris vitae ultricies leo integer malesuada. Lacus laoreet non curabitur gravida arcu ac tortor dignissim. Nulla pharetra diam sit amet nisl suscipit. Sed risus ultricies tristique nulla aliquet enim. Id neque aliquam vestibulum morbi blandit cursus risus at. Augue interdum velit euismod in pellentesque massa placerat duis ultricies. Libero justo laoreet sit amet cursus. Mi bibendum neque egestas congue quisque. Aliquet risus feugiat in ante metus. Bibendum est ultricies integer quis auctor elit sed vulputate.'
// });
// faq1.save((err) => {
//     if (err) console.log(err);
// });