module.exports = function shouldStartGame(Session) {
    if (Session.currentTurn !== -1)
        return;
    console.log(Session.starterTimerID);
    if (Session.starterTimerID !== null || !Session.activeSockets.includes(null)) { //if timer is on, or no null on active sockets
        console.log("cancelling timer")
        clearTimeout(Session.starterTimerID);
        if (Session.gamerTimerID) {
            console.log("cancelling timer 2")
            clearTimeout(Session.gamerTimerID);
        }
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