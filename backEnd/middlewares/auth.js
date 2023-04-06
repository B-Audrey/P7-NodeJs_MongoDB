const jsonWebToken = require('jsonwebtoken');

//on exporte la fonction de récupération du token
const addTokenAuth = async (req, res, next) => {
    try {
        //on recupère le token dans la requete qui sera après bearer (donc position 1, le 0 étant l'espace après bearer)
        const token = req.headers.authorization.split(' ')[1];
        //on vérifie le token envoyé avec verifiy qui prends en param le token + la clef secrete et on le stock dans une variable pour l'utiliser
        const decodedToken = jsonWebToken.verify(token, 'RANDOM_SECRET_KEY_TO_CREATE_AND_READ_A_TOKEN');
        //on extrait l'User iD du token décodé
        const userId = decodedToken.userId;
        //on renseigne l'User_iD dans req.auth
        req.auth = { userId }
        next();
    }
    catch (error){
        return res.status(401).json(error);
    }
}

module.exports = addTokenAuth;