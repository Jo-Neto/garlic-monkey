module.exports = function mainLogic(Session, data, playerWs) {
    if (Object.hasOwn(data, 'msgType')) { //check if object has required minimun property
        if (typeof data.msgContent === 'string' && !playerWs.hasPlayedThisTurn) { //check if property is a string
            if (playerWs.aID + Session.currentTurn >= Session.activeSockets.length)
                Session.game[playerWs.aID + Session.currentTurn][Session.currentTurn] = data.msgContent;
            else
                Session.game[playerWs.aID + Session.currentTurn - Session.activeSockets.length][Session.currentTurn] = data.msgContent;
            playerWs.hasPlayedThisTurn = true;
        } else
            console.log("ERROR --> game-logic.js --> msgType type error");
    } else
        console.log("ERROR --> game-logic.js --> object has no msgType property");
}