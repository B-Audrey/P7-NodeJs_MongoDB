const sharp = require('sharp');


const MIME_TYPE = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpeg',
    'image/png' : 'png'
};

const giveAFileName = (fileToRename) => {
    // prend le nom du fichier envoyé et split les valeurs entre chaque espace pour ensuite les assembler avec des "_" dans un []
    const name = fileToRename.originalname
        .split(' ')
        .join('_');
    // retire l'extension pour récupérer uniquement le nom
    nameInArray = name
        .split('.')
        .pop();
    // recupère l'extension du ficher
    const extention = MIME_TYPE[fileToRename.mimetype];
    // assemble le name récupéré, la date pour s'assurer d'avoir un nom unique, un . et l'extension
    const newName = nameInArray + Date.now() + '.' + extention;
    return newName;
}


const optimizeReceivedFile = async (req, res, next) => {
    try {
        const newName = giveAFileName(req.file);
        req.file.filename = newName;
        await sharp(req.file.buffer)
            .resize({height : 400})
            .toFile('./images/' + newName);
        next();
    }
    catch (error) {
        return res.status(404).json(error);
    }
}

module.exports = optimizeReceivedFile;