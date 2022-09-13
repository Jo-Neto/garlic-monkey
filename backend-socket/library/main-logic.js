const chatLogic = require('./chat-logic.js');

module.exports = function mainLogic(Session, data, playerWs, isWsActive) {
    if (Object.hasOwn(data, 'msgType')) { //check if object has required minimun property
        if (typeof data.msgType === 'string') { //check if property is a string
            switch (data.msgType) {
                case 'chatNew':
                    chatLogic(Session, data, playerWs);
                    break;
                case 'newData':
                    console.log("main-logic.js --> new data received");
                default:
                    console.log("ERROR --> main-logic.js --> msgType of received data is invalid");
                    break;
            }
        } else
            console.log("ERROR --> main-logic.js --> else(3) ");
    } else
        console.log("ERROR --> main-logic.js --> else(2) ");
}