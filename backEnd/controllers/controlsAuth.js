const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/modelUser');

exports.createNewUser = async(req, res, next) => {
    try {
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
        email: req.body.email,
        password: hash
        });
        await user.save();
        return res.status(201).json({message: 'Utilisateur cree avec succes'});
    }
    catch (error) {
        return res.status(400).json(error);
    }
}

exports.logIn = async (req, res, next) => {
    try {
        const userToLogIn = await User.findOne({email: req.body.email});
        if (!userToLogIn) {
            return res.status(401).json({message : 'identifant ou mot de passse incorrect'});
        }
        const goodPassword = await bcrypt.compare(req.body.password, userToLogIn.password);
        if (!goodPassword) {
            return res.status(401).json({message : 'identifant ou mot de passse incorrect'});
        }
        return res.status(200).json({
            userId: userToLogIn._id,
            token: jsonWebToken.sign(
                { userId: userToLogIn._id},
                'RANDOM_SECRET_KEY_TO_CREATE_AND_READ_A_TOKEN',
                { expiresIn: '4h'}
                )
            })
    }
    catch (error) {
        return res.status(404).json(error);
    }
}