const express = require('express');
const { findOne } = require('../models/modelBook');
const auth = require('auth')
const multer = require('../middlewares/multer-config')
const bookControllers = require('../controllers/controlsBook');

const router = express.Router();

// ROUTES ici
router.get('/', bookControllers.getAllBooks);
router.get('/bestrating', bookControllers.getBestBooks);
router.get('/:id', bookControllers.getBookById);
router.post('/', auth, multer, bookControllers.createNewBook);
router.post('/:id/rating', auth, bookControllers.addNewGrade, bookControllers.CalcAverageRating)
router.put('/:id', auth, multer, bookControllers.updateBook);
router.delete('/:id', auth, multer, bookControllers.deleteBook);


module.exports = router;