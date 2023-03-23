//importe mongoose (package qui permets de communiquer et faire passer des données valides)
const mongoose = require('mongoose');
//importe Express
const express = require('express');
const app = express();
const path = require('path');
const dbLink = 'mongodb+srv://AudeRey:yFAc2RXaOq5ekyKl@GrimoireDB.x4nhhec.mongodb.net/?retryWrites=true&w=majority';
const bodyParser = require('body-parser');
// const multer = require('multer');
// const upload = multer();

const dbConnect = async (dbLink) => {
  try{
    let res = await mongoose.connect(dbLink, { useNewUrlParser: true, useUnifiedTopology: true })
    if (!!res){
      console.log('Connexion à MongoDB réussie !')
    }
  }
  catch (error) {
    console.log('error');
  }
}
dbConnect(dbLink);

//CORS - autorise l'accès à tous
app.use((req, res, next) => {
  //acces à l'API depuis n'importe quelle origine
  res.setHeader('Access-Control-Allow-Origin', '*');
  //accepte l'acces à ces type d'headers
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //accepte ces types de routes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

//appelle les routes
const booksRoutes = require('./routes/routesBooks');
const authRoutes = require('./routes/routesAuth');

//converti tout express en JSON
app.use(bodyParser.json());
// app.use(upload.array()); 
// app.use(express.static('public'));


//défini la route a joindre pour les requetes contenant les files 'images', 2x images ??? Pourquoi ?
app.use('/image', express.static(path.join('images', 'images')));
//applique les routes définies dans le fichier routes pour les users et pour les books
app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);

//exporte le fichier app
module.exports = app;