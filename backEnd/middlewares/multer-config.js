//importe multer, package de gestion de fichiers
const multer = require('multer');
//defini les trypes de fichiers acceptés
const MIME_TYPE = {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};

// fonction diskStorage qui prends en params deux autres fonctions possibbles, ici on utilise les deux 
const storage = multer.diskStorage({
    //la destination de stockage en callback
    destination: (req, file, callback) =>{
        //fonction qui prend en param que faire en cas d'echec puis en cas de réussite, indique le chemin de stockage du fichier
        callback(null, 'images')
    },
    //le nom a attribué au fichier qui sera stocké
    filename: (res, file, callback) => {
        //le nom du fichier prend le nom du fichier envoyé et split les valeursz entre chaque espace pour ensuite les assembler avec des "_"
        const name = file.originalname.split('').join('_');
        // recupère l'extension du ficher
        const extention = MIME_TYPE[file.mimetype];
        // fonction qui va assembler le nom du fichier avec le name récupéré, la date pour s'assurer d'avoir un nom unique, un . et l'extension
        callback(null, name + Date.now() + '.' + extention)
    }
 });

module.exports = multer({ storage }).single('image');