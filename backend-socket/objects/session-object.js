module.exports = class SessionObject {
    constructor(creatorWs, sessionName) {
        this.sessionName = sessionName;
        this.isFinished = false;
        this.isMiddleGame = false;
        this.timerActive = false;
        this.timerId = null;
        this.activeSockets = [creatorWs, null, null, null, null, null]; //shall not have more than 6 elements on array
        this.waitingSockets = [];
        this.game = [];
        this.chat = []; //chat will be an array of objects, each object with "player name" and "message content" info as properties
    };
    activateTimer(time) {
        this.timerActive = true;
        this.timerId = setTimeout(() => {
            this.timerActive = false;
            if (!this.isMiddleGame) {  //first round
                this.isMiddleGame = true;
                this.activeSockets
            }   else { //subsequent rounds

            }
        }, time);
    }
};