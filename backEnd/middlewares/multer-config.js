const multer = require('multer');

const MIME_TYPE = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images')
    },
    filename: (res, file, callback) => {
        const name = file.originalname.split('').join('_');
        const extention = MIME_TYPE[file.mimetype];
        callback(null, name + Date.now() + '.' + extention)
    }
 });

module.exports = multer({ storage }).single('image');