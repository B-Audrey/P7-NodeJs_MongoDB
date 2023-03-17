const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken')
const User = require('../models/modelUser');

exports.signUp = async(req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10)
        const user = new User({
        email: req.body.email,
        password: hash
        });
    await user.save();
        res.status(201).json({message: 'Utilisateur cree avec succes'});
    }
    catch (error) {
        res.status(500).json({ error });
    }
}

exports.logIn = async (req, res, next) => {
    try {
        await User.findOne({email: req.body.email});
        if (user === null) {
            res.status(401).json({message : 'identifant ou mot de passse incorrect'})
        }
        await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            res.status(401).json({message : 'identifant ou mot de passse incorrect'})
        }
        res.status(200).json({
            userId: user._id,
            token: jsonWebToken.sign(
                { userId: user._id},
                'RANDOM_SECRET_KET_TO_CREATE_AND_READ_A_TOKEN',
                { expiresIn: '24h'}
                )
            })
    }
    catch (error) {
        res.status(500).json({ error });
    }
}