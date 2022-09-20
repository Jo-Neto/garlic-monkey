const activeSessionsArr = require('../memory-modules/active-sessions.js');
const shouldStartGame = require('../library/should-game-start-checker.js');

module.exports = function onClose(ws) {
    ws.isAlive = false;
    let removeIndex = activeSessionsArr[ws.sID].activeSockets.indexOf(ws);  //WHY THE ACTUAL FUCK DO I NEED THIS SHIIIIIIIIIIT!!!!!!!!!!!!!
    if (removeIndex !== -1) {
        activeSessionsArr[ws.sID].activeSockets[removeIndex] = null;
        shouldStartGame(activeSessionsArr[ws.sID]);
    } else {
        let removeIndexInactive = activeSessionsArr[ws.sID].waitingSockets.indexOf(ws);
        if (removeIndexInactive !== -1)
            activeSessionsArr[ws.sID].waitingSockets[removeIndexInactive] = null;
    }
    ws.terminate();
    if (activeSessionsArr[ws.sID].activeSockets.every( el => { el === null }) && activeSessionsArr[ws.sID].waitingSockets.every( el => { el === null })) //if session empty save on redis
        activeSessionsArr[ws.sID].saveOnDB(true);
    else { //player disconnected but there are still players
        //TODO: wanr who disconnected
    }
};