const redis = require('../modules/redis')

class CreateGame {

    constructor(){
        this.redis = require('../modules/redis')
    }

    static async handle (sessionName) {
        const data = await redis(sessionName)
    }
}

module.exports = CreateGame