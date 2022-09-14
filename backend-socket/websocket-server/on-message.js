const redis = require('../modules/redis');
const wsBelongsChecker = require('../library/ws-belongs-checker.js');
const mainLogic = require('../library/main-logic.js');
//const activeSessionsArr = require('../../memory-active-sessions');
module.exports = async function onMessage(data, isBinary, ws) {
    let activeSessionsArr = await redis.get()
    
    console.log("received message from ws id = "+ws.sID);

    let parsedData = {};
    try { 
        parsedData = JSON.parse(data);
    }
    catch( error ) {
        console.log('WARNING -->> on-message.js -->> catch condition: '+ error );
        return false;
    }
    if ( parsedData === null && typeof parsedData === 'object' && !Array.isArray(parsedData) )
        return false;
    if ( ws.sID >= activeSessionsArr.length ) //safety, don't try to access indexes that don't exist //<<<<<<<<<<<<< TODO: MAYBE REMOVE THIS
        return null;
    switch (wsBelongsChecker(activeSessionsArr[ws.sID], ws)) { //check socket state on session object
        case null: //session is finished, to be removed //<<<<<<<<<<<<< TODO: MAYBE REMOVE THIS
            console.log(ws.sID)
            console.log(activeSessionsArr)
            console.log('ERROR -->> on-message.js -->> socket message in finished session');
            return null;
        case -1: //socket does not belong to session
            console.log('ERROR -->> on-message.js -->> socket message in wrong session(wrong ws.sID)');
            return null;
        case 1: //socket belongs to waiting line
            mainLogic(activeSessionsArr[ws.sID], parsedData, ws, true);
            break;
        case 2: //socket belongs to active sockets
            mainLogic(activeSessionsArr[ws.sID], parsedData, ws, false);
            break;
        default:
            console.log('ERROR -->> on-message.js -->> default triggered on switch condition');
            break;
    }
    redis.set(JSON.stringify(activeSessionsArr))
};