const isAvalableId = (req, res, next) => {
    //récupère l'id des params
    const id = req.params.id;
    // RegEx (regular Expression) méthode pour controler la validité d'une donnée envoyée
    // entre 2 //; ^commence par $fini par
    // [défini le type de caractères acceptées : carcère de 0 à 9 et de a à f]
    // {défini la quantité de caractère à évaluer selon les crières données}
    // la méthode .test() renvoi un boolean qui valide ou non l'entrée donnée
    const isObjectId = /^[0-9a-f]{24}$/.test(id);
    if(!isObjectId){
        return res.status(400).json({message : "Veuillez selectionner un livre"});
    }
    next();
}

module.exports = isAvalableId;