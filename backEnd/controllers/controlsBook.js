const Book = require('../models/modelBook');

//utilise FileSystem
const fs = require('fs');

exports.getAllBooks = async (req, res, next) => {  
    try {
        const books = await Book.find();
        return res.status(200).json(books);
    }    
    catch (error) {
        return res.status(400).json(error);
    }
}

exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findOne({_id: req.params.id});
        return res.status(200).json(book);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}

exports.getBestBooks = async (req, res, next) =>{
    try {
        const bestBooks = await Book.find().sort({averageRating: -1}).limit(3);
        return res.status(200).json(bestBooks);
    }
    catch (error) {
        return res.status(404).json(error);
    } 
}

exports.createNewBook = async (req, res, next) => {
    const receivedBookObject = JSON.parse(req.body.book);
    if (receivedBookObject.title.length >= 100 || receivedBookObject.author.length >= 50 || receivedBookObject.genre.length >= 50){
        return res.status(400).json({message: "Texte trop long. Veuillez raccourcir"})
    }
    if (receivedBookObject.year.length != 4){
        return res.status(400).json({message: "Veuillez renseigner une annee a 4 chiffres"})
    }
    try {  
        const bookToCreate = new Book({
            ...receivedBookObject,
            userId: req.auth.userId,
            imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            });
        await bookToCreate.save();
        return res.status(201).json({message: 'Livre ajoute avec succes'});
    }
     catch (error) {
        return res.status(400).json(error);
    }
}

exports.addNewGrade = async (req, res, next) => {
    try{
        if(req.body.rating > 5 || req.body.rating < 0) {
            return res.status(400).json({message : 'note maximale depassee'});
        }
        const bookRateToUpdate = await Book.findOne({_id: req.params.id});
        const isAlreadyVoted = bookRateToUpdate.ratings.find((rating) => rating.userId === req.auth.userId);
        if (!!isAlreadyVoted) {
            return res.status(403).json({message: 'deja vote'})
        }
        bookRateToUpdate.ratings.push({userId : req.auth.userId, grade: req.body.rating});
        await bookRateToUpdate.save();
        next()
    }
    catch (error) {
        return res.status(400).json(error);
    }
}

const calcAverage = (book) => {
    const grades = book.ratings.map(ratings => ratings.grade);
    const result = grades.reduce( (accumulator, currentValue) => accumulator + currentValue) / grades.length;
    return result.toFixed(1);
}

exports.calcAverageRating = async(req, res, next) => {
    try {
        const bookAverageToUpdate = await Book.findOne({_id: req.params.id});
        bookAverageToUpdate.averageRating = calcAverage(bookAverageToUpdate);
        await bookAverageToUpdate.save();
        return res.status(201).json(bookAverageToUpdate);
    }
    catch (error) {
        return res.status(400).json(error);
    }
}

exports.updateBook = async (req, res, next) => {
    try{
        const bookToUpdate = await Book.findOne({_id: req.params.id});
        let receivedBookForUpdate = {};
        if(req.file?.originalname) {
            receivedBookForUpdate = JSON.parse(req.body.book);
            receivedBookForUpdate.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
            const fileNameToDelete = bookToUpdate.imageUrl.split('images/')[1];
            await fs.unlink(`./images/${fileNameToDelete}`, async (error) => {
                if(error){
                    console.log(error);
                }
            });
        }
        else {
            receivedBookForUpdate = {...req.body};
        }
        receivedBookForUpdate.userId = req.auth.userId;
        await Book.updateOne({_id: req.params.id}, {...receivedBookForUpdate, _id:req.params.id});
        return res.status(200).json({message: 'livre modifie avec succes'});
    }
    catch (error){
        return res.status(400).json(error);
    }
}


exports.deleteBook = async (req, res, next) => {
    try {
        const bookToDelete = await Book.findOne({_id: req.params.id});
        const fileName = bookToDelete.imageUrl.split('images/')[1];
        await fs.unlink(`./images/${fileName}`, async (error) => {
            if(error){
                console.log(error);
            }
            await Book.deleteOne({_id: req.params.id});
        });
        return res.status(204).json({message : 'livre supprime avec succes'});
    }
    catch (error) {
        return res.status(404).json(error);
    }
}