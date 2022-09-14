const express = require('express');
const https = require('https');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
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

app.get('/create-game', (req, res) => {
    const keysArray = []
    let stream = redis.scanStream({
        match: "session:*",
        count: 10
    });
    stream.on("data", async (keys = []) => {
        let key;
        for (key of keys) {
            key = JSON.parse(await redisModule.get(key))
            if (!keysArray.includes(key)) {
                keysArray.push(key);
                console.log(keysArray)
            }
        }
        res.json(keysArray)
    });
    stream.on("end",  () => {
        console.log("Finished finding keys")
    });
});

const httpsServer = https.createServer({
    cert: fs.readFileSync('../keys-and-certificates/cert.pem'),
    key: fs.readFileSync('../keys-and-certificates/key-rsa.pem')
  }, app);
app.listen(8080, ()=>{ console.log('https backend server is listening'); });