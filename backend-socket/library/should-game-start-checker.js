module.exports = function shouldStartGame(Session) {
    if (Session.currentTurn !== -1)
        return;
    if (Session.starterTimerID !== null && !Session.activeSockets.includes(null)) {
        clearTimeout(Session.starterTimerID);
        Session.starterTimerID = null;
        Session.activeSockets.forEach(ws => { //send new msg to all players in session
            if (ws !== null && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    msgType: 'timerUpdate',
                    msgContent: { msgContent: 'timerStop' }
                }));
            }
        });
        Session.waitingSockets.forEach(ws => { //send new msg to all players in session
            if (ws !== null && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    msgType: 'timerUpdate',
                    msgContent: { msgContent: 'timerStop' }
                }));
            }
        });
    }
    let playerCount = 0;
    Session.activeSockets.forEach(ws => {
        if (ws !== null) {
            playerCount++;
        }
    });
    if (playerCount >= 4) {
        Session.starterTimeout(); 
        Session.activeSockets.forEach(ws => { //send new msg to all players in session
            if (ws !== null && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    msgType: 'timerUpdate',
                    msgContent: { msgContent: 'timerStart' }
                }));
            }
        });
        Session.waitingSockets.forEach(ws => { //send new msg to all players in session
            if (ws !== null && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    msgType: 'timerUpdate',
                    msgContent: { msgContent: 'timerStart' }
                }));
            }
        });
    }
}