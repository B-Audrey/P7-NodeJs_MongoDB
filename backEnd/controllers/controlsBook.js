//importe le schema mongoose Book défini
const Book = require('../models/modelBook');

//utilise FileSystem
const fs = require('fs');

exports.getAllBooks = async (req, res, next) => {  
    try {
        //recupère tous les livres
        const books = await Book.find();
        //renvoi tous les livres en json avec un status 200
        return res.status(200).json(books);
    }    
    catch (error) {
        return res.status(404).json({ error });
    }
}

exports.getBookById = async (req, res, next) => {
    try {
        //recupère le livre donc l'iD est egal a celui passé en param de la requete
        const book = await Book.findOne({_id: req.params.id});
        //renvoi le livre en json
        return res.status(200).json(book);
    }
    catch (error) {
        return res.status(404).json({ error });
    }
}

exports.getBestBooks = async (req, res, next) =>{
    try {
        //recupere tous les livres
        const books = await Book.find();
            //trie le tableau de Books recu par ordre décroissant de leur note moyenne
            books.sort( (a, b) => {
            return b.averageRating - a.averageRating;
        })
        //declare un tableau
        const bestBooks = [];
        // pousse les 3 premières valeurs du tableau Book trié dans le nouveau tableau
        bestBooks.push(books[0], books[1], books[2]);
        // renvoi le tableau avec les 3 meilleurs livres
        return res.status(200).json(bestBooks);
    }
    catch (error){
        return res.status(404).json({ error });
    } 
}

exports.createNewBook = async (req, res, next) =>{
    //stock le body de la requete parsée en JSON
    console.log('je rentre dans la création d un book')
    const receivedBookObject = req.body.book;
    try {
        //génère un nouveau book
        const book = new Book({
            //passe les valeurs contenues dans l'objet
            ...receivedBookObject,
            //y ajoute l'iD de l'user qui est dans la requete
            userId: req.auth.userId,
            //y ajoute l'url reconstituée : protocole de la requete + req.get???
            imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
            // ajoute une avergae rating à -1 de base pour un affichage neutre avec averageRating >0
            averageRating:-1
            });
            console.log(book.imageUrl);
        //enregistre le new book dans la DB
        await book.save();
        // renvoi le nouveau book
        return res.status(201).json({message: 'Livre cree avec succes' + book});
    }
     catch (error) {
        res.status(400).json({ error });
    }
};

exports.addNewGrade = async(req, res, next) => {
    //supprime l'iD de la requete pour que le bon soit attribué ensuite
    delete req.body._id;
    try{
        //vérifie que la note est bien comprise entre 0 et 5, sinon, renvoie une erreur
        if(req.body.rating > 5 || req.body.rating < 0) {
            res.status(403).json({message : 'note maximale depassee'});
        }
        //stock les informations de la requete dans des variables
        const userIdToPush = req.body.userId;
        const gradeToPush = req.body.rating;
        //trouve le livre à modifer dans la DB avec l'iD des params de la requete
        const bookRateToUpdate = await Book.findOne({_id: req.params.id});
        //crée un nouvel objet à envoyer à la DB avec les nouvelles infos !!!!! PENSER A MODIFIER l'user ID par celui du token et pas celui du body
        dataToPush = {userId : userIdToPush, grade: gradeToPush};
        //rempli le tableau du book a modifier en y ajoutant les nouvelles informations
        bookRateToUpdate.ratings.push(dataToPush);
        //sauvegarde dans la DB
        await bookRateToUpdate.save();
        //va au middleware suivant
        next()
    }
    catch (error) {
        return res.status(400).json({ message : 'ajout de la note impossible' });
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
    return result.toFixed(1)
}
exports.CalcAverageRating = async(req, res, next) =>{
    try {
    //récupère le book demandé dans l'id de la requete
    const bookAverageToUpdate = await Book.findOne({_id: req.params.id});
    //calcule la nouvelle moyenne
    const newAverage = CalcAverage(bookAverageToUpdate);
    //assigne la nouvelle moyenne a la propriété averageRating du book
    bookAverageToUpdate.averageRating = newAverage;
    //sauvegarde dans la DB
    await bookAverageToUpdate.save();
    return res.status(201).json('note ajoutee avec succes')
    }
    catch (error) {
        return res.status(400).json({ message : 'erreur sur la mise à jour de la note moyenne'});
    }
}

exports.updateBook = async (req, res, next) => {
    try{
        console.log('je rentre dans l update')
        //crée un nouvel objet
        let updatedBook = {};
        //entre si il y a un objet dans la requete
        if (!!req.file){
            console.log('j ai un file')
            //stocke les infos du book envoyé en string dans une variable
            const stringReceivedBook = req.body.book;
            //parse le book en objet JSON
            parseUpdatedBook = JSON.parse(stringReceivedBook);
            //rempli l'objet
            updatedBook = {
                //les nouvelles valeur du Book
                parseUpdatedBook,
                //la nouvelle URL de l'image 
                imageUrl:`${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            }; 
        }
        //si pas d'image
        else {
            //rempli l'objet avec le body dela requete qui est deja en JSON parsé
            updatedBook = {
                ...res.body
            };
        }
        // puis dans les deux cas, supprime le userID
        delete receivedBookObject.userId;
        //cherche le livre a modifier existant dans le DB
        const bookToUpdate = await Book.findOne({_id: req.params.id});
        //si l'Id du user est différent de celui qui a créé le livre, on renvoi une erreur
        if (bookToUpdate.userId != req.auth.userId) {
            return req.status(401).json({ message: 'Non authorized'})
        } else {
            //si les id correspondent alors on mets le livre à jour
            await Book.updateOne({_id: req.params.id}, {updatedBook, _id: req.params.id})
        }
    }
    catch (error) {
        return res.status(400).json({ error });
    }
}

exports.deleteBook = async (req, res, next) => {
    try {
        //recupère le livre a supprimer
        const bookToDelete = await Book.findOne({_id: req.params.id});
        //si l'id envoyé est différent de celui du propriétaire du livre, on renvoi une erreur
        if (bookToDelete.userId != req.auth.userId) {
            return req.status(401).json({ message: 'Non authorized'})
        } else {
            //quand les id correspondent on recupère le file de l'image associé au book avec split(avant /image dans l'imageUrl du book recupéré)
            const fileName = bookToDelete.imageUrl.split('/images')[1];
            //supprime l'image du stockage des files avec la propriété unlink -> revoir fs
            await fs.unlink(`images'${fileName}`)
            //supprime le book de la DB
            await Book.deleteOne({_id: req.params.id})
        }
        return res.status(200).json({message : 'livre supprime avec succes'});
    }
    catch (error) {
        return res.status(404).json({error});
    }
 }