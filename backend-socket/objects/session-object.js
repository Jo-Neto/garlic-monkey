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
        this.activeSockets = [creatorWs, null, null, null, null, null]; 
        this.waitingSockets = [];
        this.chat = [];
        this.game = [[], []];
    };

    starterTimeout() {
        this.starterTimerID = setTimeout(() => {

            this.activeSockets = this.activeSockets.filter(ws => { return ws !== null });
            this.activeSockets = shuffler(this.activeSockets);
            this.activeSockets.forEach((ws, index) => { if (ws !== null) { ws.aID = index; } });

            for (let i = 0; i < this.activeSockets.length; i++) {
                this.game[i] = [];
                for (let j = 0; j < this.activeSockets.length; j++)
                    this.game[i][j] = null;
            }
            this.activeSockets.forEach(ws => { 
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        msgType: 'gameUpdate',
                        msgContent: { update: 'gameStart', type: 'activePlayer' }
                    }));
                }
            });
            this.waitingSockets.forEach(ws => {
                if (ws !== null && ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        msgType: 'gameUpdate',
                        msgContent: { update: 'gameStart', type: 'waitingPlayer' }
                    }));
                }
            });
            this.gameMaster(0);  //MARKUP: 
        }, 60000);  //MARKUP: starter timer
    }

    gameMaster(gameTimerAmount) {
        this.gamerTimerID = setTimeout(() => {

            this.currentTurn++;     

            
            if (this.currentTurn === this.activeSockets.length) {
                this.waitingSockets = this.waitingSockets.concat(this.activeSockets);
                this.activeSockets = [null, null, null, null, null, null];
                this.waitingSockets.forEach(ws => {
                    if (ws !== null && ws.readyState === 1) {
                        ws.aID = null;
                        ws.isUndecidedOldPlayer = true;
                        ws.hasPlayedThisTurn = true;
                    }
                });
                if(this.gamerTimerID)
                    clearTimeout(this.gamerTimerID);
                this.finisherTimeout(1, 0);
                return;
            }


  
            if (this.currentTurn > 0) {
                this.activeSockets.forEach((ws) => {
                    if (ws !== null && ws.readyState === 1) {
                        if ((ws.aID + this.currentTurn ) < this.activeSockets.length) {
                            ws.send(JSON.stringify({
                                msgType: 'gameUpdate',
                                msgContent: {
                                    update: 'roundInfo',
                                    data: this.game[Number(ws.aID + this.currentTurn )][Number(this.currentTurn - 1)]
                                }
                            }));
                        } else {
                            ws.send(JSON.stringify({
                                msgType: 'gameUpdate',
                                msgContent: {
                                    update: 'roundInfo',
                                    data: this.game[Number(ws.aID + this.currentTurn - this.activeSockets.length )][Number(this.currentTurn - 1)]
                                }
                            }));
                        }
                        if (!(this.currentTurn === this.activeSockets.length))
                            ws.hasPlayedThisTurn = false;
                    }
                });
                this.waitingSockets.forEach((ws) => {
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'gameUpdate',
                            msgContent: {
                                update: 'roundInfo',
                            }
                        }));
                    }
                });
            }

            if ((this.currentTurn % 2) === 0)
                this.gameMaster(20000); //MARKUP: timer para descrição
            else
                this.gameMaster(60000);  //MARKUP: timer para imagem

        }, gameTimerAmount)
    }; //MARKUP: round timer

    finisherTimeout(finalTimerAmount, i) {

        this.finishertimerID = setTimeout(() => {

            if (i < this.currentTurn ) {
                this.waitingSockets.forEach((ws) => {
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'finalData',
                            msgContent: this.game[i]
                        }));
                    }
                });
                if(this.finishertimerID)
                    clearTimeout(this.finishertimerID);
                this.finisherTimeout(30000, ++i);   //MARKUP: finsher time
            }

            else if (i === this.currentTurn ) {
                this.saveOnDB(false);
                this.currentTurn = -1;
                this.game = [[], []];
                this.chat = [];
                this.starterTimerID = null;
                this.gamerTimerID = null;
                this.waitingSockets.forEach(ws => {
                    if (ws !== null && ws.readyState === 1) {
                        ws.send(JSON.stringify({
                            msgType: 'finalData',
                            msgContent: { update: 'requireNewParticipationStatus' }
                        }));
                    }
                });
                if(this.finishertimerID)
                    clearTimeout(this.finishertimerID);
                this.finisherTimeout(60000, ++i);   //MARKUP: finsher time
            }

            else {
                clearTimeout(this.finishertimerID);
                this.finishertimerID = null;
                this.waitingSockets.forEach(ws => {
                    if (ws !== null && ws.readyState === 1) {
                        if (ws.isUndecidedOldPlayer) {
                            ws.close(1001, 'player has been kicked for not deciding fast enough');
                        }
                    }
                });
                this.waitingSockets = this.waitingSockets.filter(ws => { return ws !== null });
                return;
            }
        }, finalTimerAmount); //MARKUP: finsher time
    };

    saveOnDB(erase = false) {
        if (this.starterTimerID)
            clearTimeout(this.starterTimerID);
        if (this.gamerTimerID)
            clearTimeout(this.gamerTimerID);
        if (this.finishertimerID)
            clearTimeout(this.finishertimerID);
        if (erase) {
            this.isFinished = true;
            this.sessionName = null;
        }
        const body = {chat: this.chat, game: this.game};

        fetch('http://localhost:8080/send-object',  //MARKUP host
        {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));
    };
};