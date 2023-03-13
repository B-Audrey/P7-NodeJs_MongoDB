const express = require('express');
const { findOne } = require('../models/Book');
const router = express.Router();
const Book = require('../models/Book')

// ROUTES ici
router.get('/', async (req, res) => {  
    try {
        const books = await Book.find();
        return res.status(200).json(books);
    }    
    catch (error) {
        res.status(400).json({ error });
    }
})

router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findOne({_id: req.params.id});
        return res.status(200).json(book);
    }
    catch (error) {
        res.status(404).json({ error });
    }
})
/////////// MARCHE PAS ////////////
// router.get('/bestrating', async (req, res) =>{
//     try {
//         const books = await Book.find();
//         books.sort( (a, b) => {
//             return a.averageRating - b.averageRating;
//         })
//         return res.status(200).json(books[0], books[1], books[2]);
//     }
//     catch (error){
//         res.status(404).json({ error });
//     } 
// })

router.post('/', async (req, res) =>{
    delete req.body._id;
    try {
        const book = new Book({
            ...req.body
            });
        await book.save()
        return res.status(201).json({message: 'Livre cree avec succes'})
    }
    catch (error){
        res.status(400).json({ error });
    }
});

/// MARCHE PAS ENCORE ////
// router.post('/:id/rating', async(req, res) => {
//     try{
//         const rate = req.body.rating
//         const bookRateToUpdate = await Book.findOne({_id: req.params.id})
//         bookRateToUpdate.ratings.push(rate)
//     }
//     catch (error) {
//         res.status(400).json({ error });
//     }
// })

//////// MARCHE PAS /////////
// router.put('/:id', async (req, res) => {
//     try {
//         const bookToUpdate = await Book.updateOne({_id: req.params.id}, {...req.body, _id:req.params.id});
//         return res.status(201).json(bookToUpdate)
//     }
//     catch (error) {
//         res.status(400).json({ error });
//     }
// });


router.delete('/:id', async (req, res) => {
   try {
        const bookToDelete = await Book.deleteOne({_id: req.params.id});
        return res.status(200).json(bookToDelete);
    }
    catch (error) {
        res.status(404).json({error});
    }
});

module.exports = router;