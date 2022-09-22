const chatLogic = require('./chat-logic.js');
const partLogic = require('./participation-status.js');
const gameLogic = require('./game-logic.js');

module.exports = function mainLogic(Session, data, playerWs) {
    if (Object.hasOwn(data, 'msgType')) { //check if object has required minimun property
        if (typeof data.msgType === 'string') { //check if property is a string
            switch (data.msgType) {
                case 'chatNew':
                    chatLogic(Session, data, playerWs);
                    break;
                case 'newData':
                    if (playerWs.aID === null) { //inctive sockets can only chat, non started games can not receive inputs
                        if (playerWs.readyState === 1) {
                            playerWs.send(JSON.stringify({
                                msgType: 'devReport',
                                msgContent: {
                                    report: 'DENIED: player on waiting line tried sending "newData" msgType'
                                }
                            }));
                        }
                        return;
                    } else if (Session.currentTurn === -1) {
                        if (playerWs.readyState === 1) {
                            playerWs.send(JSON.stringify({
                                msgType: 'devReport',
                                msgContent: {
                                    report: 'DENIED: player tried sending "newData" before match beggining'
                                }
                            }));
                        }
                        return;
                    } else {
                        gameLogic(Session, data, playerWs);
                    }
                    break;
                case 'participationStatus': //changes player status if possible
                    partLogic(Session, data, playerWs);
                    break;
                default:
                    console.log("ERROR --> main-logic.js --> default triggered")
                    break;
            }
        } else
            console.log("ERROR --> main-logic.js --> msgType type error");
    } else
        console.log("ERROR --> main-logic.js --> object has no msgType property");
}