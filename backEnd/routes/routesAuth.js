const express = require('express');
const router = express.Router();


const authControls = require('../controllers/controlsAuth');
// ROUTES ici

router.post('/signup', authControls.signUp)

router.post('/api/auth/login', authControls.logIn)


module.exports = router;