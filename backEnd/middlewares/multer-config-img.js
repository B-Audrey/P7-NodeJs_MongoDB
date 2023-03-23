//importe multer
const multer = require('multer');
//defini les types de fichiers acceptés
const MIME_TYPE = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};
// fonction diskStorage qui prends en params deux autres fonctions possibbles, ici les deux 
const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        //fonction qui prend en param que faire en cas d'echec puis en cas de réussite, indique le chemin de stockage du fichier
        callback(null, 'images');
    },
    filename: (res, file, callback) => {
        //prend le nom du fichier envoyé et split les valeurs entre chaque espace pour ensuite les assembler avec des "_"
        const name = file.originalname.split(' ').join('_');
        // recupère l'extension du ficher
        const extention = MIME_TYPE[file.mimetype];
        // assemble le name récupéré, la date pour s'assurer d'avoir un nom unique, un . et l'extension
        callback(null, name + Date.now() + '.' + extention);
    }
 });
 // exporte storage de multer en acceptant un "single" fichier qui sera une "image"
 // multer accroche le file au req.body
// module.exports = (req, res, next) => {
//     console.log('je rentre dans ma focntion multer');
//     multer({ storage }).single('image');
//     console.log(req.file)
//     next()
// }

module.exports = multer({ storage }).single('image');