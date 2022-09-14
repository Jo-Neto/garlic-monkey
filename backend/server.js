const express = require('express')
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(cors({
    origin : "https://localhost:3000",
    credentials: true,
}));

app.get('/create-game', bodyParser, (req, res) => {
    const CreateGame = require('./controller/create-game');
    new CreateGame().handle(req.body.roomName)
});

const httpsServer = express.createServer({
    cert: fs.readFileSync('../keys-and-certificates/cert.pem'),
    key: fs.readFileSync('../keys-and-certificates/key-rsa.pem')
  }, app);
httpsServer.listen(8080, ()=>{ console.log('https backend server is listening'); });