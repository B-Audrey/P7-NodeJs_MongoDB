//importe Mongoose pour avoir accès aux propriété mongoose dans le fichier
const mongoose = require('mongoose');

//défini le shcema de données valides a utiliser pour echanger des "Book" avec la DB
const bookSchema = mongoose.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true},
    author: { type: String, required: true},
    imageUrl: { type: String, required: true},
    year: { type: Number, required: true},
    genre: { type: String, required: true},
    ratings: [{
        userId: { type:String, required: true},
        grade: { type:Number, required: true},
    }],
    averageRating: { type: Number, required: true}
});
//exporte le modele mongoose défini, accessible sous le nom 'Book'
module.exports = mongoose.model('Book', bookSchema);