const express = require('express');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const redisModule = require('./modules/redis');
const Redis = require('ioredis'),
redis = Redis.createClient({
    port: 6379,
    host: "127.0.0.1"
});
const app = express();

const pool = require('./db/postgres');


app.use(cors({
    origin : "https://localhost:9999",
    credentials: true,
}));

app.post('/send-object', jsonParser, (req, res) => {
    const object = req.body.sessionObject;
    redisModule.set(object.sessionName, object);
    
    res.json({sucessMessage: "Finish Storing"});
});

const httpsServer = https.createServer({
    cert: fs.readFileSync('../keys-and-certificates/cert.pem'),
    key: fs.readFileSync('../keys-and-certificates/key-rsa.pem')
  }, app);

app.listen(8080, ()=>{ console.log('https backend server is listening'); });