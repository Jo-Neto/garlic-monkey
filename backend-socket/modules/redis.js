const Redis = require('ioredis'),
redis = Redis.createClient({
    port: 6379,
    host: "127.0.0.1"
});
const fetch = require("node-fetch");
// redis.flushdb( function (err, succeeded) {
//     console.log(succeeded); // will be true if successfull
// });
// redis.set(`session:0`, JSON.stringify({isFinished: true, sessionName: null}))

module.exports = {
    get: async () => {

        const response = await fetch('http://localhost:8080/create-game', {method: 'GET'})
        const data = await response.json();
        console.log(data)
        return data


        // return new Promise( (resolve, reject) => {
        //     const keysArray = []
        //     let stream = redis.scanStream({
        //         match: "session:*",
        //         count: 10
        //     });
        //     stream.on("data", async (keys = []) => {
        //         let key;
        //         for (key of keys) {
        //             key = JSON.parse(await redis.get(key))
        //             if (!keysArray.includes(key)) {
        //                 keysArray.push(key);
        //             }
        //         }
        //     });
        //     stream.on("end",  () => {
        //         console.log("Finished finding keys")
        //         console.log(keysArray)
        //     });
            
        //     resolve(JSON.stringify(keysArray));
        // });
    },
    set: (activeSessionsArr) => {
        return new Promise( (resolve, reject) => {
            console.log(activeSessionsArr)
            if (activeSessionsArr.length > 1) redis.del('session:0');
            activeSessionsArr.forEach(element => {
                if(element.sessionName) 
                    redis.set(`session:${element.sessionName}`, JSON.stringify(element));
            });
            resolve({sucessMessage: "Funcionou"});
        });
    }
}