//importe express
const express = require('express');
//stocke les routes express dans la variable router
const router = express.Router();
//importe la fonction de controle d'authentification
const authControls = require('../controllers/controlsAuth');

// ROUTES ici
router.post('/signup', authControls.createNewUser);
router.post('/login', authControls.logIn);

module.exports = router;