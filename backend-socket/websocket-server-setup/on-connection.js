const SessionObject = require('../objects/session-object.js');
const activeSessionsArr = require('../memory-modules/active-sessions.js');
const shouldStartGame = require('../library/should-game-start-checker.js');

module.exports = function onConnection(ws, req) {
    let playerChoiceArr = [];
    try {
        playerChoiceArr = req.headers['sec-websocket-protocol'].split(', ');
    } catch (e) {
        ws.close(1002, 'invalid subprotocols');
        return false;
    }
    if (playerChoiceArr.length !== 2) {
        ws.close(1002, 'invalid subprotocols count');
        return false;
    }
    if (typeof playerChoiceArr[0] !== 'string' || typeof playerChoiceArr[1] !== 'string' ) {
        ws.close(1003, 'invalid subprotocols type');
        return false;
    }

    let matchedIndex = activeSessionsArr.findIndex((el) => { return el.sessionName === playerChoiceArr[0] ? true : false }); 
    let allActivePlayersName = [];
    let allWaitingPlayersName = [];
    let newRoom = false;

    if (matchedIndex === -1) { 
        newRoom = true;
        let availableIndex = activeSessionsArr.findIndex((el) => { return el.isFinished === true ? true : false });
        if (availableIndex === -1) { 
            ws.sID = activeSessionsArr.length;
            activeSessionsArr.push(new SessionObject(ws, playerChoiceArr[0]));
        } else {
            ws.sID = availableIndex;
            activeSessionsArr.splice(availableIndex, 1, new SessionObject(ws, playerChoiceArr[0]));  
        }
        allActivePlayersName = [playerChoiceArr[1], null, null, null, null, null];
        ws.aID = 0;
    } else { 
        if (activeSessionsArr[matchedIndex].isFinished) { 
            activeSessionsArr[matchedIndex].sessionName = null; 
            onConnection(ws, req); 
        }
        let shouldReturn = false;
        activeSessionsArr[matchedIndex].activeSockets.forEach(webs => {
            if (webs !== null && webs.readyState === 1) {
                if (webs.garlicName === playerChoiceArr[1]) {
                    console.log("closing 4003");
                    ws.takenName = true;
                    ws.close(4003, 'player name already taken');
                    shouldReturn = true;
                }
            }
        });
        activeSessionsArr[matchedIndex].waitingSockets.forEach(webs => {
            if (webs !== null && webs.readyState === 1) {
                if (webs.garlicName === playerChoiceArr[1]) {
                    console.log("closing 4003");
                    ws.takenName = true;
                    ws.close(4003, 'player name already taken');
                    shouldReturn = true;
                }
            }
        });
        if (shouldReturn)
            return;
            if (activeSessionsArr[matchedIndex].currentTurn !== -1) { 
            console.log("closing 1003");
            if (ws.readyState === 1)
                ws.close(1013, 'ongoing match, try again later');
            return;
        } else { 
            let replaceableSocketIndex = activeSessionsArr[matchedIndex].activeSockets.indexOf(null);
            if (replaceableSocketIndex === -1) {
                let replaceableWaitingSocketIndex = activeSessionsArr[matchedIndex].waitingSockets.indexOf(null);
                if (replaceableWaitingSocketIndex === -1)
                    activeSessionsArr[matchedIndex].waitingSockets.push(ws); 
                else
                    activeSessionsArr[matchedIndex].waitingSockets[replaceableWaitingSocketIndex] = ws;
                ws.aID = null;
            } else {
                activeSessionsArr[matchedIndex].activeSockets[replaceableSocketIndex] = ws; 
                ws.aID = replaceableSocketIndex;
            }
            shouldStartGame(activeSessionsArr[matchedIndex]);
        }
        allActivePlayersName = activeSessionsArr[matchedIndex].activeSockets.map(webs => { if (webs !== null) return webs.garlicName; });
        allWaitingPlayersName = activeSessionsArr[matchedIndex].waitingSockets.map(webs => { if (webs !== null) return webs.garlicName; });
        if (ws.readyState === 1) {
            ws.send(JSON.stringify({
                msgType: 'playerRow',
                msgContent: { activeNick: allActivePlayersName, waitingNick: allWaitingPlayersName }
            }));
        }
        activeSessionsArr[matchedIndex].activeSockets.forEach(webs => {
            if (webs !== null && webs.readyState === 1) {
                webs.send(JSON.stringify({
                    msgType: 'playerUpdate',
                    msgContent: { nick: playerChoiceArr[1], updateType: 'in', isOnGame: ws.aID }
                }));
            }
        });
        activeSessionsArr[matchedIndex].waitingSockets.forEach(webs => { 
            if (webs !== null && webs.readyState === 1) {
                webs.send(JSON.stringify({
                    msgType: 'playerUpdate',
                    msgContent: { nick: playerChoiceArr[1], updateType: 'in', isOnGame: ws.aID }
                }));
            }
        });
        ws.sID = matchedIndex; 
    }
    if (newRoom && ws.readyState === 1) {
        ws.send(JSON.stringify({
            msgType: 'playerRow',
            msgContent: { activeNick: allActivePlayersName, waitingNick: allWaitingPlayersName }
        }));
    }
    ws.garlicName = playerChoiceArr[1];
    ws.isUndecidedOldPlayer = false;
    ws.hasPlayedThisTurn = false;
};