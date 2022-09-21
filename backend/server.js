const express = require('express');
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

app.use(cors({
    origin : "https://localhost:9999",
    credentials: true,
}));

app.post('/send-object', jsonParser, (req, res) => {
    const object = req.body.sessionObject;
    redisModule.set(object.sessionName, object);
    
    res.json({sucessMessage: "Finish Storing"});
});

app.listen(8080, ()=>{ console.log('https backend server is listening'); });