
const mongoose = require('mongoose');
// importe unique validator de moongoose pour acceder aux méthodes de validation "unique" et ne pas avoir de doublons dans la DB
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true}
});

//applique le plugin enregistré dans la variable uniqueValidator aux user schema pour l'utiliser
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);