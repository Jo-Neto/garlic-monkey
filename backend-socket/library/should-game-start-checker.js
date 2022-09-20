module.exports = function shouldStartGame(Session) {
    if (Session.currentTurn !== -1 )
        return;
    if (Session.timerId !== null) {
        console.log("clearing timeout id --> "+Session.timerId);
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
        console.log("first counter activated");
        Session.timerActive = true;
        Session.activateTimer(15000); // 20 segs  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
        console.log('ctivating with id --> '+ Session.timerId)
    }
}