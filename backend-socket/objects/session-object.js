module.exports = class SessionObject {
    constructor(creatorWs, sessionName) {  
        this.sessionName = sessionName;
        this.isFinished = false;
        this.isMiddleGame = false;
        this.firstTimerOver = false;
        this.timerActive = false;
        this.timerId = null;
        this.activeSockets = [ creatorWs, null, null, null, null, null ]; //shall not have more than 6 elements on array
        this.waitingSockets = [];
        this.game = [];
        this.chat = []; //chat will be an array of objects, each object with "player name" and "message content" info as properties
    };
    activateTimer(time) {
        this.timerActive = true;
        return setTimeout( () => { console.log('timer expired'); }, time); //5 segs for testing
    }
};