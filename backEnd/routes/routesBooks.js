const express = require('express');

//importe les fichiers avec les fonctions pour les routes
const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config-img');
const bookCtrls = require('../controllers/controlsBook');
const isAvailableId = require('../middlewares/available-id');

const router = express.Router();

// ROUTES ici
router.get('/', bookCtrls.getAllBooks);
router.get('/bestrating', bookCtrls.getBestBooks);
router.get('/:id', isAvailableId ,bookCtrls.getBookById);
router.post('/', auth, multer, bookCtrls.createNewBook);
router.post('/:id/rating', auth, isAvailableId, bookCtrls.addNewGrade, bookCtrls.calcAverageRating);
router.put('/:id', auth, isAvailableId, multer, bookCtrls.updateBook);
router.delete('/:id', auth, isAvailableId, multer, bookCtrls.deleteBook);

module.exports = router;