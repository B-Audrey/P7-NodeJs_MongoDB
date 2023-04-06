const Book = require('../models/modelBook');

const isAllowed = async (req, res, next) => {
    try{
        const askedBook = await Book.findOne({_id: req.params.id});
        if(askedBook.userId != req.auth.userId) {
            res.status(401).json({message: 'non autorise'});
        }
        else {
            next()
        }
    }
    catch (error) {
        res.status(402).json(error)
    }
}

module.exports = isAllowed;