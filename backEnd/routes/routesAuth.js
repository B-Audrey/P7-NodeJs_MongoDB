
const express = require('express');

const router = express.Router();

const authControls = require('../controllers/controlsAuth');

// ROUTES ici
router.post('/signup', authControls.createNewUser);
router.post('/login', authControls.logIn);

module.exports = router;