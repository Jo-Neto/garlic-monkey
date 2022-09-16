    const Redis = require('ioredis'),
    redis = Redis.createClient({
        port: 6379,
        host: "127.0.0.1"
    });

module.exports = {
    get: (key) => {
        return new Promise( (resolve, reject) => {
            redis.get( key, async (error, data) => {
                
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
                    console.log({ sucessMessage: "Redis Hit!", data: data });

                    return reject(new Error("Object alreary in Redis"));
                };

                const object = value
                redis.set( 'activeSessions', JSON.stringify(object) );

                return resolve(object);
            });
        });
    }
}