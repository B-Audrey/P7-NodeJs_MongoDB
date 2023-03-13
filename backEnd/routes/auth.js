const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ROUTES ici

router.post('/api/auth/signup', (req, res, next) => {
    delete req.body._id;
    const user = new User({
        ...req.body
    });
    user.save().
    then(() => res.status(201).json({message: 'Utilisateur cree avec succes'}))
    .cathc(error => res.status(400).json({ error }));
});

router.post('/api/auth/login', (req, res, next) => {

})


module.exports = router;