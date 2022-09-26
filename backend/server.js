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
let i = 0;

app.use(cors({
    origin : "https://localhost:9999",
    credentials: true,
}));

app.post('/send-object', jsonParser, (req, res) => {
    const object = req.body;
    
        const objectArray = [0]
        let stream = redis.scanStream({
            match: "history:*",
            count: 10
        });
        stream.on("data", async (keys = []) => {
            try {
                let key;
                for (key of keys) {
                    key = key.split(":")
                    if (!objectArray.includes(key[1])) {
                        objectArray.push(parseInt(key[1]));
                    }
                }
                
                const NEXT_POS = objectArray[objectArray.length-1] + 1
                
                await redisModule.set(NEXT_POS, object);
                
                const data = await redisModule.get(NEXT_POS, object);
                
                res.json(data);
            } catch (error) {
                console.log(error)
                res.json({errorMessage: "Error Storing", data: error}); 
            }
        });
        stream.on("end",  () => {
            console.log("Finished finding keys")
        });
         
    
    
});

app.listen(8080, ()=>{ console.log('https backend server is listening'); });