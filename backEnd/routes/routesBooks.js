const express = require('express');

//importe les fichiers avec les fonctions pour les routes
const multer = require('../middlewares/multer-config-img');
const bookCtrls = require('../controllers/controlsBook');
const addAuth = require('../middlewares/auth');
const isAvailableId = require('../middlewares/available-id');
const isAllowed = require('../middlewares/is-allowed');
const compressFile = require('../middlewares/sharp-config-img')

const router = express.Router();

// ROUTES ici
router.get('/', bookCtrls.getAllBooks);
router.get('/bestrating', bookCtrls.getBestBooks);
router.get('/:id', isAvailableId ,bookCtrls.getBookById);
router.post('/', addAuth, multer, compressFile, bookCtrls.createNewBook);
router.post('/:id/rating', addAuth, isAvailableId, bookCtrls.addNewGrade);
router.put('/:id', addAuth,  isAvailableId, isAllowed, multer, compressFile, bookCtrls.updateBook);
router.delete('/:id', addAuth, isAvailableId, isAllowed, multer, bookCtrls.deleteBook);

module.exports = router;