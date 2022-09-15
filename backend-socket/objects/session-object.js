module.exports = class SessionObject {
    constructor(creatorWs, sessionName) {  
        this.sessionName = sessionName;
        this.isFinished = false;
        this.isMiddleGame = false;
        this.firstCounterOver = false;
        this.timerActive = false;
        this.activeSockets = [ creatorWs, null, null, null, null, null ];
        this.waitingSockets = [];
        this.game = [];
        this.chat = []; //chat will be an array of objects, each object with "player name" and "message content" info as properties
    };
    activateTimer() {
        if(!this.firstCounterOver)
            this.firstCounterOver = true;
        this.timerActive = true;
        setTimeout(()=>{console.log('timer expired')}, 5000) //5 segs for testing
    }
};