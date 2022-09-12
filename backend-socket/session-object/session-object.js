const plyerQntChecker = require('../library/player-amount-checker.js');

class SessionObject {
    constructor(creatorWs, sessionName) {  
        this.sessionName = sessionName;
        this.isFinished = false;
        this.isMiddleGame = false;
        this.activeSockets = [ creatorWs, null, null, null, null, null ];
        this.waitingSockets = [];
        this.chat = []; //chat will be an array of tuple, each tuple with "player name" and "message" info
    };
};

module.exports = SessionObject;