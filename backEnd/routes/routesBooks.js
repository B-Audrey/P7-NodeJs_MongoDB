//importe express
const express = require('express');
// POURQUOI ? JAMAIS LUE ?
// const { findOne } = require('../models/modelBook');
//importe les fichiers avec les fonctions qui vont être lues les unes après les autres dans les routes
const auth = require('../middlewares/auth')
const multer = require('../middlewares/multer-config')
const bookCtrls = require('../controllers/controlsBook');
const parseBody = require('../middlewares/body')
//stocke les routes express dans la variable router
const router = express.Router();

// ROUTES ici
router.get('/', bookCtrls.getAllBooks);
router.get('/bestrating', bookCtrls.getBestBooks);
router.get('/:id', bookCtrls.getBookById);
router.post('/', auth, multer, parseBody, bookCtrls.createNewBook);
router.post('/:id/rating', auth, bookCtrls.addNewGrade, bookCtrls.CalcAverageRating);
router.put('/:id', auth, multer, parseBody, bookCtrls.updateBook);
router.delete('/:id', auth, multer, bookCtrls.deleteBook);


module.exports = router;