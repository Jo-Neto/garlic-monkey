const activeSessionsArr = require('../memory-modules/active-sessions.js');
const shouldStartGame = require('../library/should-game-start-checker.js');

module.exports = function onClose(ws) {
    let removeIndex = null;
    if (ws.takenName)
        return;
    try {
        removeIndex = activeSessionsArr[ws.sID].activeSockets.indexOf(ws);    
        if (removeIndex !== -1) {
            activeSessionsArr[ws.sID].activeSockets[removeIndex] = null;
            shouldStartGame(activeSessionsArr[ws.sID]);
        } else {
            let removeIndexInactive = activeSessionsArr[ws.sID].waitingSockets.indexOf(ws);
            if (removeIndexInactive !== -1)
                activeSessionsArr[ws.sID].waitingSockets[removeIndexInactive] = null;
        }
    } catch (e) {
        console.log(e);
        return;
    }
    if (ws !== null)
        ws.terminate();
    try {
        if (activeSessionsArr[ws.sID].activeSockets.every(el => { el === null }) && activeSessionsArr[ws.sID].waitingSockets.every(el => { el === null })) 
            activeSessionsArr[ws.sID].saveOnDB(true);
        else { 
            activeSessionsArr[ws.sID].activeSockets.forEach(webs => { 
                if (webs !== null && webs.readyState === 1) {
                    webs.send(JSON.stringify({
                        msgType: 'playerUpdate',
                        msgContent: { nick: ws.garlicName, updateType: 'out', isOnGame: ws.aID }
                    }));
                }
            });
            activeSessionsArr[ws.sID].waitingSockets.forEach(webs => { 
                if (webs !== null && webs.readyState === 1) {
                    webs.send(JSON.stringify({
                        msgType: 'playerUpdate',
                        msgContent: { nick: ws.garlicName, updateType: 'out', isOnGame: ws.aID }
                    }));
                }
            });
        }
    } catch (e) {
        console.log(e);
    }
};