const shuffler = require('./library/fisher-yates-algo.js');

module.exports = class SessionObject {
    constructor(creatorWs, sessionName) {
        this.sessionName = sessionName;
        this.currentTurn = -1;
        this.isFinished = false;
        this.timerID = null;
        this.finishertimerID = null;
        this.newGametimerActive = false;
        this.activeSockets = [creatorWs, null, null, null, null, null]; //shall not have more than 6 elements on array
        this.waitingSockets = [];
        this.chat = [];
        this.game = [[], []];
    };
    activateTimer(time) {
        this.timerID = setTimeout(() => {
            if (this.currentTurn === -1) {  //first round

                console.log("first round logic start, round number --> " + (this.currentTurn + 1));
                this.activeSockets = this.activeSockets.filter(ws => { return ws !== null });
                this.activeSockets = shuffler(this.activeSockets);
                this.activeSockets.forEach((ws, index) => { if (ws !== null) { ws.aID = index; } });
                for (let i = 0; i < this.activeSockets.length; i++) {
                    this.game[i] = [];
                    for (let j = 0; j < this.activeSockets.length; j++)
                        this.game[i][j] = null;
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

                console.log("round number: " + (this.currentTurn + 1) + "logic start");
                this.activeSockets.forEach(ws => { //send new msg to all players in session
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'roundChange', newRound: (this.currentTurn + 1) }
                        }));
                    }
                });
                this.waitingSockets.forEach(ws => { //send new msg to all players in session
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: { update: 'roundChange', newRound: (this.currentTurn + 1) }
                        }));
                    }
                });

                if (this.activeSockets.length !== this.currentTurn + 1) {
                    console.log("sending round info, round number --> " + this.currentTurn + 1);
                    this.activeSockets.forEach((webs) => {
                        if (webs !== null && webs.readyState === 1) {
                            if ((webs.aID + this.currentTurn - 1) < this.activeSockets.length) {
                                webs.send(JSON.stringify({
                                    msgType: 'gameUpdate',
                                    msgContent: {
                                        update: 'roundInfo',
                                        data: this.game[Number(playerWs.aID + Session.currentTurn - 1)][Number(this.currentTurn - 1)]
                                    }
                                }));
                            } else {
                                webs.send(JSON.stringify({
                                    msgType: 'gameUpdate',
                                    msgContent: {
                                        update: 'roundInfo',
                                        data: this.game[Number(playerWs.aID + Session.currentTurn - Session.activeSockets.length - 1)][Number(this.currentTurn - 1)]
                                    }
                                }));
                            }
                        }
                    });
                }

                if (this.activeSockets.length === this.currentTurn + 1) { //match ended
                    console.log("match ending, round number --> " + this.currentTurn + 1);
                    this.waitingSockets = this.waitingSockets.concat(this.activeSockets);
                    this.activeSockets = [null, null, null, null, null, null];
                    this.waitingSockets.forEach(ws => { //send new msg to all players in session
                        if (ws !== null && ws.readyState === 1) {
                            ws.aID = null;
                            ws.isUndecidedOldPlayer = true;
                            ws.hasPlayedThisTurn = true;
                        }
                    });
                    if (this.timerID)
                        clearTimeout(this.timerID);
                    this.finisherInterval();
                }
            }

            console.log("ending subsequent round");
            if (!(this.activeSockets.length === this.currentTurn + 1)) { //if match has not finished
                console.log("activating new timer");
                this.currentTurn++;
                this.activateTimer(30000);
                this.activeSockets.forEach(ws => { if (ws !== null) { ws.hasPlayedThisTurn = false; } });
            }

        }, time);
    }

    finisherInterval() {

        console.log("finisher interval running");
        let i = 0;
        this.finishertimerID = setInterval(() => {
            
            this.waitingSockets.forEach(ws => { //send new msg to all players in session
                if (ws !== null && ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        msgType: 'gameUpdate',
                        msgContent: { update: 'gameEnd', finalData: this.game[i] }
                    }));
                }
            });

            if (i === this.currentTurn) {
                this.saveOnDB(false);
                this.currentTurn = -1;
                this.game = [[], []];
                this.chat = [];
                clearInterval(this.finishertimerID);
                this.finishertimerID = null;
                //give 60 segs to decide if will play, if not kick
                if (ws !== null && ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        msgType: 'gameUpdate',
                        msgContent: { update: 'requireNewParticipationStatus' }
                    }));
                }
                this.newGametimerActive = true;
            }

            if ( i > this.currentTurn) {
                this.newGametimerActive = false;
                this.waitingSockets.forEach(ws => { 
                    if (ws !== null && ws.readyState === 1) {
                        if (ws.isUndecidedOldPlayer) {
                            ws.close(1001, 'player has been kicked for not deciding fast enough');
                            ws.terminate();
                        }
                    }
                });
            }  
            i++;
        }, 60000);
    }

    saveOnDB(erase = false) {
        console.log("save on db called");
        if (this.timerID)
            clearTimeout(this.timerID);
        if (this.finishertimerID)
            clearInterval(this.finishertimerID)
        if (erase) {
            this.sessionName = null;
            this.isFinished = true;
        }
        //save data on database here
    }
};