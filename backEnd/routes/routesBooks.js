const express = require('express');

//importe les fichiers avec les fonctions qui vont être lues les unes après les autres dans les routes
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config-img');
const bookCtrls = require('../controllers/controlsBook');

//stocke les routes express dans la variable router
const router = express.Router();

// ROUTES ici
router.get('/', bookCtrls.getAllBooks);
router.get('/bestrating', bookCtrls.getBestBooks);
router.get('/:id', bookCtrls.getBookById);
router.post('/', auth, multer, bookCtrls.createNewBook);
router.post('/:id/rating', auth, bookCtrls.addNewGrade, bookCtrls.CalcAverageRating);
router.put('/:id', auth, multer, bookCtrls.updateBook);
router.delete('/:id', auth, multer, bookCtrls.deleteBook);


module.exports = router;