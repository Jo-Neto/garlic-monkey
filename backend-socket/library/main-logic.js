const chatLogic = require('./chat-logic.js');
const partLogic = require('./participation-status.js');
const gameLogic = require('./game-logic.js');

module.exports = function mainLogic(Session, data, playerWs) {
    if (Object.hasOwn(data, 'msgType')) { 
        if (typeof data.msgType === 'string') { 
            switch (data.msgType) {
                case 'chatNew':
                    chatLogic(Session, data, playerWs);
                    break;
                case 'newData':
                    if (playerWs.aID === null) { 
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
                case 'participationStatus': 
                    partLogic(Session, data, playerWs);
                    break;
                default:
                    break;
            }
        } 
    } 
}