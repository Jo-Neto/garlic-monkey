const activeSessionsArr = require('../memory-modules/active-sessions.js');

const mainLogic = require('../library/main-logic.js');

module.exports = function onMessage(data, isBinary, ws) {
    console.log("received message from ws id = " + ws.sID);
    let parsedData = {};
    try {
        parsedData = JSON.parse(data);
    } catch (error) {
        console.log('WARNING -->> on-message.js -->> catch condition: ' + error);
        return false;
    }
    if (!(parsedData !== null && typeof parsedData === 'object' && !Array.isArray(parsedData)))
        return false;
    if (ws.sID >= activeSessionsArr.length) //safety, don't try to access indexes that don't exist //<<<<<<<<<<<<< TODO: MAYBE REMOVE THIS
        return null;
    mainLogic(activeSessionsArr[ws.sID], parsedData, ws);
};

//TODO: socket status checker before send