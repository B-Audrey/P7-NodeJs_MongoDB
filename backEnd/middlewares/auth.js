const jsonWebToken = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = res.headers.authorization.split(' ')[1];
        const decodedToken = jsonWebToken.verify(token, 'RANDOM_SECRET_KET_TO_CREATE_AND_READ_A_TOKEN');
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        }
    }
    catch (error){
        res.status(401).json({ error })
    }
}