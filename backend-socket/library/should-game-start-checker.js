module.exports = function shouldStartGame(Session) {
    console.log("should start running");
    console.log(Session.currentTurn);
    if (Session.currentTurn !== -1 )
        return;
    if (Session.timerId !== null) {
        clearTimeout(Session.timerId);
        Session.timerId = null;
        Session.timerActive = false;
        Session.timerActive = true;
        Session.activateTimer(30000); // 30 segs  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        Session.activeSockets.forEach(ws => { //send new msg to all players in session
            if (ws !== null && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    msgType: 'gameUpdate',
                    msgContent: { msgContent: 'timerStop' }
                }));
            }
        });
        Session.waitingSockets.forEach(ws => { //send new msg to all players in session
            if (ws !== null && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    msgType: 'gameUpdate',
                    msgContent: { msgContent: 'timerStop' }
                }));
            }
        });
    }
    let playerCount = 0;
    Session.activeSockets.forEach(ws => {
        if (ws !== null)
            playerCount++;
    });
    if (playerCount >= 4) {
        Session.timerActive = true;
        Session.activateTimer(15000); // 20 segs  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        Session.activeSockets.forEach(ws => { //send new msg to all players in session
            if (ws !== null && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    msgType: 'gameUpdate',
                    msgContent: { msgContent: 'timerStart' }
                }));
            }
        });
        Session.waitingSockets.forEach(ws => { //send new msg to all players in session
            if (ws !== null && ws.readyState === 1) {
                ws.send(JSON.stringify({
                    msgType: 'gameUpdate',
                    msgContent: { msgContent: 'timerStart' }
                }));
            }
        });
    }
}