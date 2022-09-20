const shuffler = require('./library/fisher-yates-algo.js');

module.exports = class SessionObject {
    constructor(creatorWs, sessionName) {
        this.sessionName = sessionName;
        this.currentTurn = -1;
        this.isFinished = false;
        this.timerActive = false;
        this.timerId = null;
        this.activeSockets = [creatorWs, null, null, null, null, null]; //shall not have more than 6 elements on array
        this.waitingSockets = [];
        this.game = [[],[]];
    };
    activateTimer(time) {
        this.timerActive = true;
        this.timerId = setTimeout(() => {
            this.timerActive = false;
            if (this.currentTurn === -1) {  //first round

                console.log("active socket have been shuffled -->> " + this.activeSockets);
                this.activeSockets = this.activeSockets.filter(ws => { return ws !== null });
                this.activeSockets = shuffler(this.activeSockets);
                this.activeSockets.forEach((ws, index) => { ws.aID = index; });

                for (let i = 0; i++; i < this.activeSockets.length) {
                    PassAssoArr[i] = [];
                    for (let j = 0; j++; j < this.activeSockets.length)
                        this.game[i][j] = null;
                }

                this.activeSockets.forEach(ws => { //send new msg to all players in session
                    if (ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'game has started round ' + this.currentTurn }
                        }));
                    }
                });

                this.waitingSockets.forEach(ws => { //send new msg to all players in session
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'game has started round ' + this.currentTurn }
                        }));
                    }
                });

            } else { //subsequent rounds

                console.log("subsequent rounds");
                this.activeSockets.forEach(ws => { //send new msg to all players in session
                    if (ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'round ' + this.currentTurn }
                        }));
                    }
                });

                this.waitingSockets.forEach(ws => { //send new msg to all players in session
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'round ' + this.currentTurn }
                        }));
                    }
                });

                if (this.activeSockets.length === this.currentTurn + 1) { //match ended

                    console.log("match end conditional");
                    this.activeSockets.forEach(ws => { //send new msg to all players in session
                        if (ws.readyState === 1) {
                            ws.send(JSON.stringify({
                                msgType: 'gameUpdate',
                                msgContent: { update: 'game ended', finalData: this.game }
                            }));
                        }
                    });

                    this.waitingSockets.forEach(ws => { //send new msg to all players in session
                        if (ws !== null && ws.readyState === 1) {
                            ws.send(JSON.stringify({
                                msgType: 'gameUpdate',
                                msgContent: { update: 'game ended', finalData: this.game }
                            }));
                        }
                    });

                    this.currentTurn = -1;
                    this.game = [];

                } 
            }
            this.activateTimer(5000);
            this.currentTurn++;
            console.log("finishing timer logic");
        }, time);
    }
};

//TODO: TIMER, REPLAYER, DISCONNECTOR, FINISHER