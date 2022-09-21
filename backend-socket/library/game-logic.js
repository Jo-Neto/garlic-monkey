module.exports = function mainLogic(Session, data, playerWs) {
    if (Object.hasOwn(data, 'msgType')) { //check if object has required minimun property
        if (typeof data.msgContent === 'string' && !playerWs.hasPlayedThisTurn) { //check if property  */
            console.log(Session.game)
            if (playerWs.aID + Session.currentTurn < Session.activeSockets.length) {
                /*            console.log('if')
                              console.log(typeof playerWs.aID);
                              console.log(typeof Session.currentTurn);
                              console.log(playerWs.aID + Session.currentTurn);
                              console.log('index 2 ='+ Session.currentTurn); */
                let obj = {};
                if (Session.currentTurn % 2 !== 0)
                    obj = {
                        type: 'image',
                        data: data.msgContent
                    };
                else
                    obj = {
                        type: 'desc',
                        data: data.msgContent
                    };
                Session.game[Number(playerWs.aID + Session.currentTurn)][Number(Session.currentTurn)] = obj;
            }
            else {
                /*          console.log('else')
                            console.log(typeof playerWs.aID);
                            console.log(typeof Session.currentTurn);
                            console.log(typeof Session.activeSockets.length);
                            console.log(playerWs.aID + Session.currentTurn - Session.activeSockets.length);
                            console.log(typeof (playerWs.aID + Session.currentTurn - Session.activeSockets.length));
                            console.log('index 2 ='+ Session.currentTurn); */
                let obj = {};
                if (Session.currentTurn % 2 !== 0)
                    obj = {
                        type: 'image',
                        data: data.msgContent
                    };
                else
                    obj = {
                        type: 'desc',
                        data: data.msgContent
                    };
                Session.game[Number(playerWs.aID + Session.currentTurn)][Number(Session.currentTurn)] = obj;
            }
            playerWs.hasPlayedThisTurn = true;
            console.log(Session.game);
        } else
            console.log("ERROR --> game-logic.js --> msgType type error or player has tried playing twice");
    } else
        console.log("ERROR --> game-logic.js --> object has no msgType property");
}