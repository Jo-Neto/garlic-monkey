const https = require('https');
const fs = require('fs');
const Websocket = require('ws');

const HTTPSserver = https.createServer({
  cert: fs.readFileSync('../keys-and-certificates/cert.pem'),
  key: fs.readFileSync('../keys-and-certificates/key-rsa.pem')
},
  (req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  });

const wss = new Websocket.WebSocketServer({ server: HTTPSserver });

const serverSetup = require('./socket-server-setup.js');
serverSetup(wss);
HTTPSserver.listen(9999, () => { console.log('https server is listening'); });

module.exports = {
  wss,
  HTTPSserver
};