const express = require('express');

//importe les fichiers avec les fonctions pour les routes
const multer = require('../middlewares/multer-config-img');
const bookCtrls = require('../controllers/controlsBook');
const addAuth = require('../middlewares/auth');
const isAvailableId = require('../middlewares/available-id');
const isAllowed = require('../middlewares/is-allowed');

const router = express.Router();

// ROUTES ici
router.get('/', bookCtrls.getAllBooks);
router.get('/bestrating', bookCtrls.getBestBooks);
router.get('/:id', isAvailableId ,bookCtrls.getBookById);
router.post('/', addAuth, multer, bookCtrls.createNewBook);
router.post('/:id/rating', addAuth, isAvailableId, bookCtrls.addNewGrade, bookCtrls.calcAverageRating);
router.put('/:id', addAuth,  isAvailableId, isAllowed,multer, bookCtrls.updateBook);
router.delete('/:id', addAuth, isAvailableId, isAllowed, multer, bookCtrls.deleteBook);

module.exports = router;