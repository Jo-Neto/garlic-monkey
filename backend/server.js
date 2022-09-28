const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json({limit: '1mb', extended: true});
const redisModule = require('./modules/redis');
const Redis = require('ioredis'),
redis = Redis.createClient({
    port: 6380,
    host: "127.0.0.1"
});
const app = express();
let i = 0;

app.use(cors({
    origin : "https://localhost:9999", //MARKUP host
    credentials: true,
}));

app.post('/send-object', jsonParser, (req, res) => {
    const object = req.body;
    
        const objectArray = []
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
                objectArray.push(0)
                console.log(objectArray)
                const pos = objectArray.reduce(function(a, b) {
                return Math.max(a, b);
                }, -Infinity);

                const NEXT_POS = pos + 1
                
                await redisModule.set(NEXT_POS, object);  [0]
                
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

app.listen(8080, ()=>{ console.log('redis server is listening'); });