const activeSessionsArr = require('../../memory-active-sessions');

module.exports = function onClose(ws) {
    ws.isAlive = false;
    let removeIndex = activeSessionsArr[ws.sID].activeSockets.indexOf(ws);  //WHY THE ACTUAL FUCK DO I NEED THIS SHIIIIIIIIIIT!!!!!!!!!!!!!
    if (removeIndex !== -1) 
        activeSessionsArr[ws.sID].activeSockets[removeIndex] = null;
    ws.terminate();
    ws = null; 
};