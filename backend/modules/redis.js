const Redis = require('ioredis'),
redis = Redis.createClient({
    port: 6379,
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

                    return resolve(data);
                };
                return resolve({});
            });
        });
    },
    set: (key, value) => {
        return new Promise( (resolve, reject) => {
            redis.get( key, async (error, data) => {
                if( error ) {
                    console.error(error);

                    return reject(error);
                };

                if( data != null ) {
                    console.log({ sucessMessage: "Redis Hit! Object Updated", data: data });
                    const object = value
                    redis.setex( key, 10, JSON.stringify(object), (err, result) => {
                        if( err ){
                            console.log(err);
    
                            return reject(err);
                        }
                        
                        console.log(result + ": Stored on Redis")
                    });
                    
                    return resolve(object);
                };

                const object = value
                
                redis.setex( key, 10, JSON.stringify(object), (err, result) => {
                    if( err ){
                        console.log(err);

                        return reject(err);
                    }

                    console.log(result + ": Stored on Redis")
                });

                return resolve(object);
            });
        });
    }
}