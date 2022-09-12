const activeSessionsArr = require('../../memory-active-sessions');

const wsBelongsChecker = require('../library/ws-belongs-checker.js'); //return true if ws belongs to session
const chatLogic = require('../library/chat-logic.js');

module.exports = function onMessage(data, isBinary, ws) {
    ///TODO: check if parseable
    console.log(JSON.parse(data));
    if (ws.sID >= activeSessionsArr.length) //safety, don't try to access indexes that don't exist
        return null;
    //check if session is not finished???????
    switch (wsBelongsChecker(activeSessionsArr[ws.sID], ws)) { //check socket state on session object
        case null: //session is finished, to be removed
            return null;
        case -1: //socket does not belong to session
            return null;
        case 1: //socket belongs to waiting line
            return null;
        case 2: //socket belongs to active sockets
            return null;
    }
    activeSessionsArr[ws.sID]
    console.log(ws.sID);
};