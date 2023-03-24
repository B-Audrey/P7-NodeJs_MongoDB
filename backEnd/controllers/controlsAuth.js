//importe bcrypt: un package pour crypter les MdP dans un seul sens
//et pouvoir vérifier si les 2 hashs générés proviennent de la même string
const bcrypt = require('bcrypt');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/modelUser');

exports.createNewUser = async(req, res, next) => {
    try {
        //génère unhash en 1er et le stock avec la méthode hash() de bcrypt dans une variable
        //param de la methode : le password du body et le nombre de salage avant de faire le hash
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
        email: req.body.email,
        password: hash
        });
        await user.save();
        return res.status(201).json({message: 'Utilisateur cree avec succes'});
    }
    catch (error) {
        return res.status(500).json({ error });
    }
}

exports.logIn = async (req, res, next) => {
    try {
        const userToLogIn = await User.findOne({email: req.body.email});
        if (!userToLogIn) {
            return res.status(401).json({message : 'identifant ou mot de passse incorrect'});
        }
        //si l'utilisateur est existant, la méthode bcrypt compare prend en 1er param le MdP envoyé et celui dejà haché stocké dans la DB
        const goodPassword = await bcrypt.compare(req.body.password, userToLogIn.password);
        // si compare renvoie false
        if (!goodPassword) {
            return res.status(401).json({message : 'identifant ou mot de passse incorrect'});
        }
        //si compare est true on renvoi un token et le user
        return res.status(200).json({
            userId: userToLogIn._id,
            //sign génère un token qui encodera les propriété passées en params
            token: jsonWebToken.sign(
                { userId: userToLogIn._id},
                //clef secrete du token
                'RANDOM_SECRET_KET_TO_CREATE_AND_READ_A_TOKEN',
                //fixe la duree de validité du token
                { expiresIn: '24h'}
                )
            })
    }
    catch (error) {
        return res.status(500).json({ error });
    }
}