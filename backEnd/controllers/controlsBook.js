const Book = require('../models/modelBook');
const fs = require('fs');

exports.getAllBooks = async (req, res) => {  
    try {
        const books = await Book.find();
        return res.status(200).json(books);
    }    
    catch (error) {
        res.status(400).json({ error });
    }
}

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findOne({_id: req.params.id});
        return res.status(200).json(book);
    }
    catch (error) {
        res.status(404).json({ error });
    }
}

exports.getBestBooks = async (req, res) =>{
    try {
        const books = await Book.find();
            books.sort( (a, b) => {
            return b.averageRating - a.averageRating;
        })
        const bestBooks = [];
        bestBooks.push(books[0], books[1], books[2]);
        return res.status(200).json(bestBooks);
    }
    catch (error){
        res.status(404).json({ error });
    } 
}

exports.createNewBook = async (req, res, next) =>{
    const receivedBookObject = JSONparse(req.body.book);
    delete receivedBookObject._id;
    delete receivedBookObject._userId;
    try {
        const book = new Book({
             ...receivedBookObject,
             userId: req.auth.userId,
             imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
             averageRating:-1
             });
        await book.save()
        return res.status(201).json({message: 'Livre cree avec succes'})
    }
     catch (error) {
        res.status(400).json({ error });
    }
};

exports.addNewGrade = async(req, res, next) => {
    delete req.body._id;
    try{
        if(req.body.rating > 5 || req.body.rating < 0) {
            res.status(403).json({message : 'note maximale depassee'})
            }
        const userIdToPush = req.body.userId;
        const gradeToPush = req.body.rating;
        const bookRateToUpdate = await Book.findOne({_id: req.params.id});
        dataToPush = {userId : userIdToPush, grade: gradeToPush};
        bookRateToUpdate.ratings.push(dataToPush);
        await bookRateToUpdate.save();
        next()
    }
    catch (error) {
        res.status(400).json({ message : 'ajout de la note impossible' });
    }
}

const CalcAverage = (book) => {
    const grades = book.ratings.map(ratings => ratings.grade);
    console.log(grades);
    let sum = 0;
    for (const grade of grades) {
      sum += grade;  
    }
    sum /= grades.length;
    return sum.toFixed(1)
}
exports.CalcAverageRating = async(req, res, next) =>{
    try {
    const bookAverageToUpdate = await Book.findOne({_id: req.params.id});
    const newAverage = CalcAverage(bookAverageToUpdate);
    bookAverageToUpdate.averageRating = newAverage
    await bookAverageToUpdate.save();
    res.status(201).json('note ajoutee avec succes')
    }
    catch (error) {
        res.status(400).json({ message : 'erreur sur la mise à jour de la note moyenne'});
    }
}

exports.updateBook = async (req, res) => {
    try{
        let updatedBook = {}
        if (!!req.file){
            const stringReceivedBook = req.body.book;
            stringReceivedBook.JSON.parse(stringReceivedBook);
            updatedBook = {
                stringReceivedBook,
                imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }; 
        }
        else {
            updatedBook = {
                ...res.body
            };
        }
        delete receivedBookObject.userId;
        const bookToUpdate = await Book.findOne({_id: req.params.id});
        if (bookToUpdate.userId != req.auth.userId) {
            req.status(401).json({ message: 'Non authorized'})
        } else {
            await Book.updateOne({_id: req.params.id}, {updatedBook, _id: req.params.id})
        }
    }
    catch (error) {
        res.status(400).json({ error });
    }
}

exports.deleteBook = async (req, res, next) => {
    try {
    const bookToDelete = await Book.findOne({_id: req.params.id});
    if (bookToDelete.userId != req.auth.userId) {
        req.status(401).json({ message: 'Non authorized'})
    } else {
        const fileName = bookToDelete.imageUrl.split('/images')[1];
        await fs.unlink(`images'${fileName}`)
        await Book.deleteOne({_id: req.params.id})
    }
    return res.status(200).json({message : 'livre supprime avec succes'});
     }
     catch (error) {
         res.status(404).json({error});
     }
 }