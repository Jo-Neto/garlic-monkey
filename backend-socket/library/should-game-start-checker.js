module.exports = function shouldStartGame(Session) {
    console.log("should start running");
    console.log(Session.currentTurn);
    if (Session.currentTurn !== -1 )
        return;
    if (Session.timerId !== null) {
        clearTimeout(Session.timerId);
        Session.timerId = null;
        Session.timerActive = false;
    }
    let playerCount = 0;
    Session.activeSockets.forEach(ws => {
        if (ws !== null)
            playerCount++;
    });
    if (playerCount >= 4) {
        Session.timerActive = true;
        Session.activateTimer(15000); // 20 segs  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    }
}