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
    set: (value) => {
        return new Promise( (resolve, reject) => {
            redis.get( value.name, async (error, data) => {
                if( error ) {
                    console.error(error);

                    return reject(error);
                };

                if( data != null ) {
                    console.log({ sucessMessage: "Redis Hit! Object Updated", data: data });
                    const object = value
                    redis.set( object.name, JSON.stringify(object) );
                    
                    return resolve(object);
                };

                const object = value
                redis.set( object.name, JSON.stringify(object) );

                return resolve(object);
            });
        });
    }
}