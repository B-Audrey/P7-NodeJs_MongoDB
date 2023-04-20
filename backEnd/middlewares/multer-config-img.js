const multer = require('multer');
//defini les types de fichiers acceptés


const storage = multer.memoryStorage();

// exporte storage de multer en acceptant un "single" fichier qui sera envoyé sous "image" par le front
// multer accroche le file au req.body
module.exports = multer({ storage }).single('image');