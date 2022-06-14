const multer = require('multer');
const path = require('path');
const short = require('short-uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/temp');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}__${short.generate()}${path.extname(file.originalname)}`);
    }
})

module.exports.upload = multer({
    storage: storage
});