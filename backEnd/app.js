//importe Express
const express = require('express');

const app = express();
//importe mongoose (package qui permets de communiquer et faire passer des données valides)
const mongoose = require('mongoose');

//appelle les routes
const booksRoutes = require('./routes/routesBooks');
const authRoutes = require('./routes/routesAuth');
//
const path = require('path');

//lie à MongoDB
mongoose.connect('mongodb+srv://AudeRey:yFAc2RXaOq5ekyKl@cluster0.x4nhhec.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'))

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

//converti tout express en JSON
app.use(express.json());
//défini la route a joindre pour les requetes contenant les files 'images'
app.use('/image', express.static(path.join('images', 'images')));
//applique les routes définies dans le fichier routes pour les users et pour les books
app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);

//exporte le fichier app
module.exports = app;