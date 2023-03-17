//importe Express
const express = require('express');

const app = express();
//importe mongoose
const mongoose = require('mongoose');

const booksRoutes = require('./routes/routesBooks');
const authRoutes = require('./routes/routesAuth');
const path = require('path');
//lie à MongoDB
mongoose.connect('mongodb+srv://AudeRey:yFAc2RXaOq5ekyKl@cluster0.x4nhhec.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


//CORS - autorise l'accès à tous
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

//renvoie du express en JSON
app.use(express.json());
app.use('/image', express.static(path.join(_dirname, 'images')))
app.use('/api/books', booksRoutes);
app.use('/api/auth', authRoutes);


module.exports = app;