module.exports = function mainLogic(Session, data, playerWs) {
    if (Object.hasOwn(data, 'msgType')) { //check if object has required minimun property
        if (typeof data.msgContent === 'string' && !playerWs.hasPlayedThisTurn) { //check if property  */
            console.log(Session.game);
            console.log("===========================================================================================");
            if (playerWs.aID + Session.currentTurn < Session.activeSockets.length) {
                let obj = {};
                if (Session.currentTurn % 2 !== 0)
                    obj = {
                        type: 'image',
                        owner: playerWs.garlicName,
                        round: Session.currentTurn,
                        data: data.msgContent
                    };
                else
                    obj = {
                        type: 'desc',
                        owner: playerWs.garlicName,
                        round: Session.currentTurn,
                        data: data.msgContent
                    };
                //console.log("accessing index [" + Number(playerWs.aID + Session.currentTurn) + "][" + Number(Session.currentTurn) + "]");
                Session.game[Number(playerWs.aID + Session.currentTurn)][Number(Session.currentTurn)] = obj;
            }
            else {
                let obj = {};
                if (Session.currentTurn % 2 !== 0)
                    obj = {
                        type: 'image',
                        owner: playerWs.garlicName,
                        round: Session.currentTurn,
                        data: data.msgContent
                    };
                else
                    obj = {
                        type: 'desc',
                        owner: playerWs.garlicName,
                        round: Session.currentTurn,
                        data: data.msgContent
                    };
                //console.log("accessing index [" + Number(playerWs.aID + Session.currentTurn - Session.activeSockets.length) + "][" + Number(Session.currentTurn) + "]");
                Session.game[Number(playerWs.aID + Session.currentTurn - Session.activeSockets.length)][Number(Session.currentTurn)] = obj;
                if (playerWs !== null && playerWs.readyState === 1) {
                    playerWs.send(JSON.stringify({
                        msgType: 'devReport',
                        msgContent: {
                            report: 'newData object received'
                        }
                    }));
                }
            }
            playerWs.hasPlayedThisTurn = true;
            console.log(Session.game);
            console.log("===========================================================================================");
            console.log("===========================================================================================");
            console.log("===========================================================================================");
            console.log("===========================================================================================");
            console.log("===========================================================================================");
            console.log("==========================================================================================="); 
        } else
            console.log("ERROR --> game-logic.js --> msgType type error or player has tried playing twice");
    } else
        console.log("ERROR --> game-logic.js --> object has no msgType property");
}