const https = require('https');
const fs = require('fs');
const Websocket = require('ws');

const express = require('express');
const app = express();

const HTTPSserver = https.createServer({
  cert: fs.readFileSync('../keys-and-certificates/cert.pem'),
  key: fs.readFileSync('../keys-and-certificates/key-rsa.pem')
}, app)
  /*(req, res) => {
    res.writeHead(200);
    res.redirect('http://localhost/3000');
    res.end('hello world\n');
  },*/

app.get('/', (req, res) => {
  res.redirect('http://66.135.2.21:3000/');
});

const wss = new Websocket.WebSocketServer({ server: HTTPSserver });

const serverSetup = require('./socket-server-setup.js');
serverSetup(wss);
HTTPSserver.listen(9999, () => { console.log('https server is listening'); });

module.exports = {
  wss,
  HTTPSserver
};
