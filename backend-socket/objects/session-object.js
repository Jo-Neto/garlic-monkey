class SessionObject {
    constructor(creatorWs, sessionName) {  
        this.sessionName = sessionName;
        this.isFinished = false;
        this.isMiddleGame = false;
        this.activeSockets = [ creatorWs, null, null, null, null, null ];
        this.waitingSockets = [];
        this.game = [];
        this.chat = []; //chat will be an array of objects, each object with "player name" and "message content" info as properties
    };
};

module.exports = SessionObject;