const SessionObject = require('../session-object/session-object.js');
const activeSessionsArr = require('../../memory-active-sessions');

module.exports = function onConnection(ws, req) {
    //TODO: check if parseable and is actually a string
    playerChoiceArr = req.headers['sec-websocket-protocol'].split(', ');
    //console.log(playerChoiceArr[0]);
    //console.log(playerChoiceArr[1]);
    //console.log(playerChoiceArr[2]);
    let matchedIndex = activeSessionsArr.findIndex( (el) => { return el.sessionName === playerChoiceArr[0] ? true : false }); //find index of the first match found from player's name choice
    if (matchedIndex === -1) { //didn't found session with the player's choice name
        let availableIndex = activeSessionsArr.findIndex((el) => { return el.isFinished === true ? true : false }); //check if finished match available on array for replacement
        if (availableIndex === -1) { //if no match available for replacement
            availableIndex = activeSessionsArr.length;  //then get array length
            activeSessionsArr.push(new SessionObject(ws, playerChoiceArr[0])); //create new match on end of array
        }   else  //if there is a match available for replacement
            activeSessionsArr.splice(availableIndex, 1, new SessionObject(ws, playerChoiceArr[0]));  //create new match and replace the finished one
        ws.sID = availableIndex; //assign session ID for socket
    } else { //player chosen name for session found
        if (activeSessionsArr[matchedIndex].isFinished) { //if chosen session is finished
            activeSessionsArr[matchedIndex].sessionName = null; //nullify session name
            onConnection(ws, req); //re-do logic
        } else { //if not finished
            activeSessionsArr[matchedIndex].playersSockets[activeSessionsArr[matchedIndex].playersSockets.findIndex((el) => { return ( el = null ? true : false ) })] = ws;  //assign player socket to first free socket of the match
            ws.sID = matchedIndex; //assign session ID for socket
            //===================================test attribution start HERE =======================================
        }
    }
};

//TODO: send match data
'"roomname3", "nick_name", "pass_word"'