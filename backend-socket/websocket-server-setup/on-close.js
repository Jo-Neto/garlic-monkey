const activeSessionsArr = require('../../memory-active-sessions.js');
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
};

//TODO cancel timer for game start
//TODO quiter status for sockets that quit middle game