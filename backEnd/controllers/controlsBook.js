const Book = require('../models/modelBook');

//utilise FileSystem
const fs = require('fs');

exports.getAllBooks = async (req, res, next) => {  
    try {
        const books = await Book.find();
        return res.status(200).json(books);
    }    
    catch (error) {
        return res.status(404).json({ error });
    }
}

exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findOne({_id: req.params.id});
        return res.status(200).json(book);
    }
    catch (error) {
        return res.status(404).json({ error });
    }
}

exports.getBestBooks = async (req, res, next) =>{
    try {
        const books = await Book.find();
        books.sort( (a, b) => {
            return b.averageRating - a.averageRating;
            });
        const bestBooks = [];
        bestBooks.push(books[0], books[1], books[2]);
        return res.status(200).json(bestBooks);
    }
    catch (error) {
        return res.status(404).json({ error });
    } 
}

exports.createNewBook = async (req, res, next) => {
    const receivedBookObject = JSON.parse(req.body.book);
    try {  
        const bookToCreate = new Book({
            ...receivedBookObject,
            userId: req.auth.userId,
            imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            });
        await bookToCreate.save();
        return res.status(201).json( {message: 'Livre ajoute avec succes'} );
    }
     catch (error) {
        return res.status(400).json({ error });
    }
}

exports.addNewGrade = async (req, res, next) => {
    try{
        if(req.body.rating > 5 || req.body.rating < 0) {
            return res.status(403).json( {message : 'note maximale depassee'} );
        }
        const dataToPush = {userId : req.auth.userId, grade: req.body.rating};
        const bookRateToUpdate = await Book.findOne({_id: req.params.id});
        const ratingArray = bookRateToUpdate.ratings;
        const alreadyAddGrade = ratingArray.find((rating) => rating.userId === req.auth.userId);
        if (!!alreadyAddGrade) {
            return res.status(400).json( {message: 'deja vote'} )
        }
        bookRateToUpdate.ratings.push(dataToPush);
        await bookRateToUpdate.save();
        next()
    }
    catch (error) {
        return res.status(400).json({ error });
    }
}
//fonction de calcul de la moyenne
const CalcAverage = (book) => {
    //prends les notes des books et les maps dans un nouveau tableau
    const grades = book.ratings.map(ratings => ratings.grade);
    //créé un resultat
    let sum = 0;
    //additionne toutes les notes
    for (const grade of grades) {
      sum += grade;  
    }
    //divise par le nombre total de notes
    const result = sum /= grades.length;
    //renvoi le resultat arrondi à 1 decimale
    return result.toFixed(1);
}
exports.CalcAverageRating = async(req, res, next) => {
    try {
        const bookAverageToUpdate = await Book.findOne({_id: req.params.id});
        const newAverage = CalcAverage(bookAverageToUpdate);
        bookAverageToUpdate.averageRating = newAverage;
        await bookAverageToUpdate.save();
        return res.status(201).json(bookAverageToUpdate);
    }
    catch (error) {
        return res.status(400).json({ error });
    }
}

exports.updateBook = async (req, res, next) => {
    try{
        //on lance la recherche du livre demandé
        const bookToUpdate = await Book.findOne({_id: req.params.id});
        // on s'assure que le user est autorisé a modifier
        if(bookToUpdate.userId != req.auth.userId) {
            res.status(401).json({message: 'non autorise'});
        }
        //si oui, on regarde si il y a un file et on rempli l'objet
        let receivedBookForUpdate = {};
        if(!!req.file) {
            receivedBookForUpdate = JSON.parse(req.body.book);//récupère le body de la requete envoyée en string et la parse
            receivedBookForUpdate.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;// y ajoute l'url reconstituée
            //si j'ai un file a remplacer, je supprime celle existante
            const fileNameToDelete = bookToUpdate.imageUrl.split('images/')[1];
                    const deleteImg = await fs.unlink(`./images/${fileNameToDelete}`, async (error) => {
                        if(error){
                            console.log(error);
                        }
                        console.log('image localement supprimee')
                    });

        }
        if(!req.file) {
            receivedBookForUpdate = {...req.body};
        }
        receivedBookForUpdate.userId = req.auth.userId;
        await Book.updateOne({_id: req.params.id}, {...receivedBookForUpdate, _id:req.params.id});
        return res.status(200).json({message: 'livre modifie avec succes'});
    }
    catch (error){
        return res.status(400).json({ error });
    }
}

exports.deleteBook = async (req, res, next) => {
    try {
        const bookToDelete = await Book.findOne({_id: req.params.id});
        if (bookToDelete.userId != req.auth.userId) {
            return res.status(401).json({ message: 'Non authorized'});
        } else {
            const fileName = bookToDelete.imageUrl.split('images/')[1];
            const deleteImg = await fs.unlink(`./images/${fileName}`, async (error) => {
                if(error){
                    console.log(error);
                }
                const deleteBook = await Book.deleteOne({_id: req.params.id});
            });
        }
        return res.status(200).json({message : 'livre supprime avec succes'});
    }
    catch (error) {
        return res.status(404).json({error});
    }
 }