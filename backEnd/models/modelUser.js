//importe Mongoose pour avoir accès aux propriété mongoose dans le fichier
const mongoose = require('mongoose');
// importe unique validator de moongoose qui permets d'acceder aux méthodes de validation "unique" et ne pas avoir de doublons dans la DB
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

//applique le plugin enregistré dans la variable uniqueValidator aux user schema pour l'utiliser
// POURQUOI ON DECLARE PAS AVANT L'INITIALISATION d'UserSchema ?
userSchema.plugin(uniqueValidator);

//exporte le modele mongoose défini, accessible sous le nom 'User'
module.exports = mongoose.model('User', userSchema);