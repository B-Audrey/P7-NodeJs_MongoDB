const sharp = require('sharp');


const MIME_TYPE = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg',
    'image/png' : 'png'
};

const optimizeReceivedFile = async (req, res, next) => {
    try {
        if (req.file) {
            req.file.filename = Math.floor(Math.random()*100) +''+ Date.now() + '.' + MIME_TYPE[req.file.mimetype];
            await sharp(req.file.buffer)
                .resize({height : 400})
                .toFile('./images/' + req.file.filename);
        }
        next();
    }
    catch (error) {
        return res.status(404).json(error);
    }
}

module.exports = optimizeReceivedFile;