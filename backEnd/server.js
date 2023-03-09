const http = require ('http');

const server = http.createServer((req, res) => {
    res.end('La réponse du serveur est ici');
});

server.listen(process.env.PORT || 3000);