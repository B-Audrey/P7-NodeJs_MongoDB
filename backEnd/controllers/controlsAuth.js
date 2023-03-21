//importe bcrypt: un package pour crypter les MdP dans un seul sens
//et pouvoir vérifier si les 2 hashs générés proviennent de la même string
const bcrypt = require('bcrypt');
//importe jsonWebToken pour générer des tokens uniques
const jsonWebToken = require('jsonwebtoken');
//importe le model mongoose user créé
const User = require('../models/modelUser');

exports.createNewUser = async(req, res, next) => {
    try {
        //génère unhash en 1er et le stock avec la méthode hash() de bcrypt dans une variable
        //param de la methode : le password du body et le nombre de salage avant de faire le hash
        const hash = await bcrypt.hash(req.body.password, 10);
        console.log(hash)
        //création d'un nouvel  objet User selon le schema Mongoose
        const user = new User({
        //on renseigne l'Id de la requete
        email: req.body.email,
        // on renseigne le hash obtenu
        password: hash
        });
        console.log(user)
        //on sauve le nouvel User la la DB
        const newUser = await user.save();
        return res.status(201).json({message: 'Utilisateur cree avec succes'});
    }
    catch (error) {
        return res.status(500).json({ error });
    }
}

exports.logIn = async (req, res, next) => {
    try {
        //on cherche le user dans la DB
        const userToLogIn = await User.findOne({email: req.body.email});
        console.log('1' + userToLogIn)
        //si il est inexistant, on sort de la fonction
        if (!userToLogIn) {
            return res.status(401).json({message : 'identifant ou mot de passse incorrect'})
        }
        //si l'utilisateur est existant, la méthode bcrypt compare prend en 1er param le MdP envoyé et celui dejà haché stocké dans la DB
        const goodPassword = await bcrypt.compare(req.body.password, userToLogIn.password);
        console.log('2' + goodPassword)
        // si compare renvoie false
        if (!goodPassword) {
            return res.status(401).json({message : 'identifant ou mot de passse incorrect'});
        }
        //si compare est true on renvoi un token et le user
        return res.status(200).json({
            userId: userToLogIn._id,
            //méthode sign génère un token qui encodera les propriété passées en params
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