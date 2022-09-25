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

app.post('/send-object', jsonParser, async (req, res) => {
    const { object } = req.body;
    
    const objectArray = [0]
    let stream = await redis.scanStream({
        match: "history:*",
        count: 10
    });
    await stream.on("data", async (keys = []) => {
        let key;
        for (key of keys) {
            key = key.split(":")
            if (!objectArray.includes(key[1])) {
                objectArray.push(key[1]);
            }
        }
    });
    await stream.on("end",  () => {
        console.log("Finished finding keys")
    });

    const NEXT_POS = objectArray[objectArray.length-1] + 1

    redisModule.set(`history:${NEXT_POS}`, object);
    
    redisModule.get(NEXT_POS, object);
    
    res.json({sucessMessage: "Finish Storing", data: "data"});
});

app.listen(8080, ()=>{ console.log('https backend server is listening'); });