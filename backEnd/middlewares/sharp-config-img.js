const sharp = require('sharp');


const MIME_TYPE = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg',
    'image/png' : 'png'
};

const giveAFileName = (fileToRename) => {
    return Date.now() + '.' + MIME_TYPE[fileToRename.mimetype];
}

const optimizeReceivedFile = async (req, res, next) => {
    try {
        if (req.file) {
            const newName = giveAFileName(req.file);
            req.file.filename = newName;
            await sharp(req.file.buffer)
                .resize({height : 400})
                .toFile('./images/' + newName);
        }
        next();
    }
    catch (error) {
        return res.status(404).json(error);
    }
}

module.exports = optimizeReceivedFile;