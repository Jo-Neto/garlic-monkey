const Redis = require('ioredis'),
redis = Redis.createClient({
    port: 6379,
    host: "127.0.0.1"
});

module.exports = (key) => {
    return new Promise( (resolve, reject) => {
        redis.get( 'activeSessions', async (error, data) => {
            if( error ) {
                console.error(error);

                return reject(error);
            };

            if( data != null ) {
                console.log({ sucessMessage: "Redis Hit!", data: data });
                parsedData = JSON.parse(data)
                parsedData.push({isFinished: true, sessionName: key})

                return resolve(parsedData);
            };

            const SESSION_DATA = require('../../memory-active-sessions')
            redis.set( 'activeSessions', JSON.stringify(SESSION_DATA) );
            return resolve(SESSION_DATA);
        });
    });
}