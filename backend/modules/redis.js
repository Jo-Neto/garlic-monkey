const Redis = require('ioredis'),
redis = Redis.createClient({
    port: 6380,
    host: "127.0.0.1"
});

module.exports = {
    get: (key) => {
        return new Promise( (resolve, reject) => {
            redis.get( `history:${key}`, async (error, data) => {
                if( error ) {
                    console.error(error);

                    return reject(error);
                };

                if( data != null ) {
                    console.log({ sucessMessage: "Redis Hit!", data: data });

                    return resolve({ sucessMessage: "Redis Hit!", data: data });
                };
                return resolve(data);
            });
        });
    },
    set: (key, value) => {
        return new Promise( (resolve, reject) => {
            redis.get( `history:${key}`, async (error, data) => {
                if( error ) {
                    console.error(error);

                    return reject(error);
                };

                if( data != null ) {
                    console.log({ errorMessage: "Redis Hit! Object already stored", data: data });
                    
                    return reject({ errorMessage: "Redis Hit! Object already stored", data: data });
                };

                const object = value
                
                redis.setex( `history:${key}`, 10 * 60, JSON.stringify(object), (err, result) => {
                    if( err ){
                        console.log(err);

                        return reject(err);
                    }

                    console.log(result + ": Stored on Redis")
                });

                return resolve({ sucessMessage: "Object Stored!", data: object });
            });
        });
    }
}