module.exports = function shouldStartGame(Session) {
    if (Session.isMiddleGame)
        return;
    let playerCount = 0;
    Session.activeSockets.forEach( ws => {
        if (ws !== null)
            playerCount++;
    });
    if (playerCount >= 4) {
        Session.timerActive = true;
        Session.timerId = Session.activateTimer(10000); // 20 segs  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    } else {
        Session.timerActive = false;
        if (Session.timerId !== null) {
            clearTimeout(Session.timerId);
            Session.timerId = null;
        }
    }
}