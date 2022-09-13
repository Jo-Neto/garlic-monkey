const SessionObject = require('../objects/session-object.js');
const activeSessionsArr = require('../../memory-active-sessions');

module.exports = function onConnection(ws, req) {
    let playerChoiceArr = [];
    try {
        playerChoiceArr = req.headers['sec-websocket-protocol'].split(', ');
    } catch (e) {
        ws.close(1002, 'invalid subprotocols');
        ws.terminate(); //safety 
        console.log('on-connection.js --> catch condition: ' + e);
        return false;
    }
    if (playerChoiceArr.length !== 2) {
        ws.close(1002, 'invalid subprotocols count');
        ws.terminate(); //safety 
        console.log('on-connection.js --> invalid subprotocols argument count');
        return false;
    }
    if (typeof playerChoiceArr[0] !== 'string' || typeof playerChoiceArr[1] !== 'string' /*|| typeof playerChoiceArr[2] !== 'string'*/) {
        ws.close(1003, 'invalid subprotocols type');
        ws.terminate(); //safety 
        console.log('on-connection.js --> subprotocols type error');
        return false;
    }
    let matchedIndex = activeSessionsArr.findIndex((el) => { return el.sessionName === playerChoiceArr[0] ? true : false }); //find index of the first match found from player's name choice
    if (matchedIndex === -1) { //didn't found session with the player's choice name
        console.log('on-connection.js --> if(1) triggered');
        let availableIndex = activeSessionsArr.findIndex((el) => { return el.isFinished === true ? true : false }); //check if finished match available on array for replacement
        if (availableIndex === -1) { //if no match available for replacement
            console.log('on-connection.js --> if(1-2) triggered');
            activeSessionsArr.push(new SessionObject(ws, playerChoiceArr[0])); //create new match on end of array
        } else { //if there is a match available for replacement
            console.log('on-connection.js --> else(1-2) triggered');
            activeSessionsArr.splice(availableIndex, 1, new SessionObject(ws, playerChoiceArr[0]));  //create new match and replace the finished one
        }
        ws.sID = activeSessionsArr.length;; //assign session ID for socket
    } else { //player chosen name for session found
        console.log('on-connection.js --> else(1) triggered');
        if (activeSessionsArr[matchedIndex].isFinished) { //if chosen session is finished
            console.log('on-connection.js --> if(2-1) triggered');
            activeSessionsArr[matchedIndex].sessionName = null; //nullify session name
            onConnection(ws, req); //re-do logic
        } else { //if not finished
            console.log('on-connection.js --> else(2-2) triggered');
            let replaceableSocketIndex = activeSessionsArr[matchedIndex].activeSockets.findIndex((el) => { return (el === null ? true : false) });
            if (replaceableSocketIndex === -1) {
                console.log("assigning to waiting");
                activeSessionsArr[matchedIndex].waitingSockets.push(ws); //assign socket to waiting socket list
            }
            else {
                console.log("assigning to active as index: " + replaceableSocketIndex);
                activeSessionsArr[matchedIndex].activeSockets[replaceableSocketIndex] = ws;  //assign socket to first free socket of the match
            }
        }
        ws.sID = matchedIndex; //assign session ID for socket
    }
    ws.garlicName = playerChoiceArr[1];
};

//TODO: send match data and MAYBE check if player name