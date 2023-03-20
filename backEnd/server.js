// appelle les méthodes http de Node pour écouter les requetes
const http = require('http');
//importe le fichier app.js
const app = require('./app');

//fonction qui défini le port sur lequel écouter les requetes
const normalizePort = (val) => {
  //déclare la valeur du port et la parse ne un nombre entier qui sera calculé sur une base 10
  const port = parseInt(val, 10);
  // si le résultat obtenu n'est pas un nombre, renvoi la valeur
  if (isNaN(port)) {
    return val;
  }
  // si le resultat ok, retourne le port
  if (port >= 0) {
    return port;
  }
  // sinon retourne false
  return false;
};

// défini port avec la fonction et passe le numéro en argument (si le premier : un port configuré par défaut est false, alors prends 3000)
const port = normalizePort(process.env.PORT || '3000');
// utilise la méthode set avec le port défini
// POURQUOI SET ? QUELLE UTILITE DE CETTE LIGNE ?
app.set('port', port);

//fonction qui le retour des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// déclare le server et lui attribue les méthodes d'écoute http avec la méthode create server
//et prends en param le fichier app pour exectuer les instructions qui seront dedans
const server = http.createServer(app);

//écoute le serveur, + d'infos ???
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
