const chatLogic = require('./chat-logic.js');
const partLogic = require('./participation-status.js');

module.exports = function mainLogic(Session, data, playerWs, isWsActive) {
    if (Object.hasOwn(data, 'msgType')) { //check if object has required minimun property
        if (typeof data.msgType === 'string') { //check if property is a string
            switch (data.msgType) {
                case 'chatNew':
                    chatLogic(Session, data, playerWs);
                    break;
                case 'newData':
                    if (playerWs.aID === null || !Session.isMiddleGame) { //inctive sockets can only chat, non started games can not receive inputs
                        playerWs.send(JSON.stringify({
                            msgType: 'devReport',
                            msgContent: {
                                report: 'DENIED: player on waiting line tried sending "newData" msgType'
                            }
                        }));
                        return;
                    } else {
                        //game logic here
                    }
                    console.log("main-logic.js --> 'newData' received");
                case 'participationStatus': //changes player status if possible
                    console.log("main-logic.js --> 'participationStatus' received");
                    partLogic(Session, data, playerWs);
                    console.log("main-logic.js --> 'participationStatus' processed");
                default:
                    console.log("ERROR --> main-logic.js --> msgType of received data is invalid");
                    break;
            }
        } else
            console.log("ERROR --> main-logic.js --> msgType type error");
    } else
        console.log("ERROR --> main-logic.js --> object has no msgType property");
}

//TODO: TIMER, REPLAYER, CHANGE WAITING/PLAYING, DISCONNECTOR