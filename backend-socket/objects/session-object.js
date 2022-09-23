const shuffler = require('./library/fisher-yates-algo.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = class SessionObject {
    constructor(creatorWs, sessionName) {
        this.sessionName = sessionName;
        this.currentTurn = -1;
        this.isFinished = false;
        this.starterTimerID = null;
        this.gamerTimerID = null;
        this.finishertimerID = null;
        this.activeSockets = [creatorWs, null, null, null, null, null]; //shall not have more than 6 elements on array
        this.waitingSockets = [];
        this.chat = [];
        this.game = [[], []];
    };

    starterTimeout() {
        this.starterTimerID = setTimeout(() => {
            console.log("first timeout logic start, round number --> " + this.currentTurn);

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
                        msgContent: { update: 'gameStart', type: 'activePlayer' }
                    }));
                }
            });
            this.waitingSockets.forEach(ws => { //send new msg to all players in session
                if (ws !== null && ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        msgType: 'gameUpdate',
                        msgContent: { update: 'gameStart', type: 'waitingPlayer' }
                    }));
                }
            });
            this.gameMaster(0);  //MARKUP: first round timer
        }, 15000);  //MARKUP: starter timer
    }

    gameMaster(gameTimerAmount) {
        this.gamerTimerID = setTimeout(() => {

            this.currentTurn++;
            console.log("interval called round number --> " + this.currentTurn);

            if (this.activeSockets.length === (this.currentTurn + 1)) { //match ended
                console.log("match ending, round number --> " + this.currentTurn);
                this.waitingSockets = this.waitingSockets.concat(this.activeSockets);
                this.activeSockets = [null, null, null, null, null, null];
                this.waitingSockets.forEach(ws => { //send new msg to all players in session
                    if (ws !== null && ws.readyState === 1) {
                        ws.aID = null;
                        ws.isUndecidedOldPlayer = true;
                        ws.hasPlayedThisTurn = true;
                    }
                });
                if (this.gamerTimerID)
                    clearInterval(this.gamerTimerID);
                this.finisherInterval();
                return;
            }

            /*this.activeSockets.forEach(ws => { //send new msg to all players in session
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
            });*/

            if (this.currentTurn > 0) {
                console.log("sending round info of round --> " + this.currentTurn);
                this.activeSockets.forEach((ws) => {
                    if (ws !== null && ws.readyState === 1) {
                        if ((ws.aID + this.currentTurn /*- 1*/) < this.activeSockets.length) {
                            ws.send(JSON.stringify({
                                msgType: 'gameUpdate',
                                msgContent: {
                                    update: 'roundInfo',
                                    data: this.game[Number(ws.aID + this.currentTurn /*- 1*/)][Number(this.currentTurn - 1)]
                                }
                            }));
                        } else {
                            ws.send(JSON.stringify({
                                msgType: 'gameUpdate',
                                msgContent: {
                                    update: 'roundInfo',
                                    data: this.game[Number(ws.aID + this.currentTurn - this.activeSockets.length /*- 1*/)][Number(this.currentTurn - 1)]
                                }
                            }));
                        }
                    }
                });
            }

            if (!(this.activeSockets.length === this.currentTurn + 1)) { //if match has not finished
                console.log("activating new timer");
                if ((this.currentTurn % 2) === 0)
                    this.gameMaster(15000); //timer para descriição
                else
                    this.gameMaster(30000);  //timer para imagem
                this.activeSockets.forEach(ws => { if (ws !== null) { ws.hasPlayedThisTurn = false; } });
            }
            console.log("ending game logic on round --> " + this.currentTurn);

        }, gameTimerAmount)
    }; //MARKUP: round timer

    finisherInterval(finalTimerAmount) {

        console.log("finisher interval running");
        let i = 0;
        this.finishertimerID = setInterval(() => {

            if (i <= this.currentTurn) {
                this.waitingSockets.forEach((ws) => {
                    if (ws !== null && ws.readyState === 1) {
                        if ((ws.aID + this.currentTurn /*- 1*/) < this.activeSockets.length) {
                            ws.send(JSON.stringify({
                                msgType: 'finalData',
                                msgContent: this.game[i]
                            }));
                        }
                    }
                });
                this.finisherInterval(60);
            }

            else if (i === (this.currentTurn + 1)) {
                this.saveOnDB(false);
                this.currentTurn = -1;
                this.game = [[], []];
                this.chat = [];
                this.finishertimerID = null;
                //give 60 segs to decide if will play, if not kick
                this.waitingSockets.forEach(ws => {
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'finalData',
                            msgContent: { update: 'requireNewParticipationStatus' }
                        }));
                    }
                });
                this.finisherInterval(60);
            }

            if (i === (this.currentTurn + 2)) {
                this.waitingSockets.forEach(ws => {
                    if (ws !== null && ws.readyState === 1) {
                        if (ws.isUndecidedOldPlayer) {
                            ws.close(1001, 'player has been kicked for not deciding fast enough');
                            ws.terminate();
                        }
                    }
                });
                clearInterval(this.finishertimerID);
            }

            i++;
        }, finalTimerAmount); //MARKUP: finsher time
    };

    saveOnDB(erase = false) {
        console.log("save on db called");
        if (this.starterTimerID)
            clearInterval(this.starterTimerID);
        if (this.gamerTimerID)
            clearTimeout(this.gamerTimerID);
        if (this.finishertimerID)
            clearInterval(this.finishertimerID);
        if (erase) {
            this.isFinished = true;
        }
        //save data on database here
        const object = JSON.stringify({chat: this.chat, game: this.game})
        console.log(this.game)
        this.sessionName = null;            

        fetch('http://localhost:8080/send-object', 
        {
            method: 'POST',
            headers: {
                body: {object}
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
            
    };
};