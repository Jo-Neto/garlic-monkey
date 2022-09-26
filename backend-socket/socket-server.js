const https = require('https');
const fs = require('fs');
const Websocket = require('ws');

const express = require('express');
const app = express();

const HTTPSserver = https.createServer({
  cert: fs.readFileSync('../keys-and-certificates/cert.pem'),
  key: fs.readFileSync('../keys-and-certificates/key-rsa.pem')
}, app)

app.get('/', (req, res) => {
  res.redirect('http://localhost:3000/');
});

const wss = new Websocket.WebSocketServer({ server: HTTPSserver });

const serverSetup = require('./socket-server-setup.js');
serverSetup(wss);
HTTPSserver.listen(9999, () => { console.log('https server is listening'); });

module.exports = {
  wss,
  HTTPSserver
};
