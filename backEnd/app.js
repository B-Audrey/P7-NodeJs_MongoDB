//importe mongoose (package qui permets de communiquer et faire passer des données valides)
const mongoose = require('mongoose');
//importe Express
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const booksRoutes = require('./routes/routesBooks');
const authRoutes = require('./routes/routesAuth');


const dbConnect = async () => {
  try{
    const res = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true })
    if (!!res){
      console.log('Connexion à MongoDB réussie !')
    }
  }
  catch (error) {
    console.log('error');
  }
}
dbConnect();

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
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status).json(err.message);
});
app.use(express.static('images'));



//défini la route a joindre pour les requetes contenant les files 'images'
app.use('/images', express.static(path.join('images')));
//applique les routes définies dans le fichier routes pour les users et pour les books
app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);

//exporte le fichier app
module.exports = app;