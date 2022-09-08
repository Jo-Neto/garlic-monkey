const https = require('https');
const fs = require('fs');
const Websocket = require('ws');


const server = https.createServer({
    cert: fs.readFileSync('./cert.pem'),
    key: fs.readFileSync('./key-rsa.pem')
  },
    (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
});

const wss = new Websocket.WebSocketServer({ server: server });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });

    ws.send('something');
});

server.listen(8080);

module.exports = wss;