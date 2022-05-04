const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;
const dbConnect = require('../dbConnect');

// dbConnect.connect();

const UserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    street: {
        type: String
    },
    city: {
        type: String
    },
    state: {
        type: String,
        maxlength: 2,
        uppercase: true
    },
    zip: {
        type: String,
        maxlength: 7,
        uppercase: true
    },
    cart: [String],
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    userLevel: {
        type: Number,
        min: 0,
        max: 2,
        default: 1,
        required: true
    }
}, {
    timestamps: true
});

const options = {
    usernameField: 'email',
    errorMessages: {
        UserExistsError: 'An account with the provided email is already in use.'
    }
}

UserSchema.plugin(passportLocalMongoose, options);

const User = mongoose.model('User', UserSchema);

// const user = new User({
//     email: 'petropoulosalex@gmail.com',
//     firstName: 'Alex',
//     lastName: 'Petropoulos',
//     street: '84 Bude Street',
//     city: 'Toronto',
//     state: 'ON',
//     zip: 'M6C 1X8',
//     orders: [
//         '626f6dce05e2b8b1ca68e919'
//     ],
//     userLevel: 2
// })

// User.register(user, 'W4tgr33e3#')
//     .then(() => {
//     }).catch((e) => {
//     });

module.exports = User;