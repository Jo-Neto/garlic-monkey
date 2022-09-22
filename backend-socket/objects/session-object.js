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
        this.chat = [];
        this.game = [[], []];
    };
    activateTimer(time) {
        this.timerActive = true;
        this.timerId = setTimeout(() => {
            this.timerActive = false;
            if (this.currentTurn === -1) {  //first round

                this.activeSockets = this.activeSockets.filter(ws => { return ws !== null });
                this.activeSockets = shuffler(this.activeSockets);
                this.activeSockets.forEach((ws, index) => { if (ws !== null) { ws.aID = index; } });

                for (let i = 0; i < this.activeSockets.length; i++) {
                    this.game[i] = [];
                    for (let j = 0; j < this.activeSockets.length; j++)
                        this.game[i][j] = 0;
                }

                this.activeSockets.forEach(ws => { //send new msg to all players in session
                    if (ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'gameStart' }
                        }));
                    }
                });

                this.waitingSockets.forEach(ws => { //send new msg to all players in session
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'gameStart' }
                        }));
                    }
                });

            } else { //subsequent rounds

                console.log("subsequent rounds");

                this.activeSockets.forEach(ws => { //send new msg to all players in session
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'roundChange', newRound: this.currentTurn }
                        }));
                    }
                });

                this.waitingSockets.forEach(ws => { //send new msg to all players in session
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'roundChange', newRound: this.currentTurn }
                        }));
                    }
                });

                if (this.activeSockets.length === this.currentTurn + 1) { //match ended

                    console.log("match ending");

                    this.waitingSockets = this.waitingSockets.concat(this.activeSockets);
                    this.activeSockets = [null, null, null, null, null, null];

                    this.waitingSockets.forEach(ws => { //send new msg to all players in session
                        if (ws !== null && ws.readyState === 1) {
                            ws.aID = null;
                            ws.send(JSON.stringify({
                                msgType: 'gameUpdate',
                                msgContent: { update: 'gameEnd', finalData: this.game }
                            }));
                        }
                    });

                    this.saveOnDB(false);
                    this.currentTurn = -1;
                    this.game = [[], []];
                    this.chat = [];
                }

                if (this.activeSockets.length !== this.currentTurn + 1) {
                    console.log("sending round info");
                    this.activeSockets.forEach((webs) => {
                        if (webs !== null && webs.readyState === 1) {
                            if (this.currentTurn > 0) {
                                if (webs.aID + this.currentTurn < this.activeSockets.length) {
                                    webs.send(JSON.stringify({
                                        msgType: 'gameUpdate',
                                        msgContent: {
                                            update: 'roundInfo',
                                            data: this.game[Number(webs.aID + this.currentTurn)][Number(this.currentTurn - 1)]
                                        }
                                    }));
                                } else {
                                    webs.send(JSON.stringify({
                                        msgType: 'gameUpdate',
                                        msgContent: {
                                            update: 'roundInfo',
                                            data: this.game[Number(webs.aID + this.currentTurn - this.activeSockets.length)][Number(this.currentTurn - 1)]
                                        }
                                    }));
                                }
                            }
                        }
                    });
                }
            }
            console.log("ending subsequent round");
            this.currentTurn++;
            this.activeSockets.forEach(ws => { if (ws !== null) { ws.hasPlayedThisTurn = false; } });
            console.log("ending subsequent round");
            if (!(this.activeSockets.length === this.currentTurn + 1)) { //if match has not finished
                console.log("activating new timer")
                this.activateTimer(30000);
            }
        }, time);
    }
    saveOnDB(erase = false) {
        if (this.timerActive)
            clearTimeout(this.timerId);
        console.log("save on db called");
        if (erase) {
            this.sessionName = null;
            this.isFinished = true;
        }
    }
};