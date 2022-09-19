module.exports = function chatLogic(Session, data, playerWs) {
    if (Object.hasOwn(data, 'msgContent')) { //object has this property
        if (typeof data.msgContent === 'string') { //and msgContent is string
            Session.chat.push({ nick: playerWs.garlicName, msgContent: data.msgContent });
            Session.activeSockets.forEach( ws => { //send new msg to all players in session
                
                if (ws !== null) {
                    //console.log(ws)
                    ws.send(JSON.stringify({
                        msgType: 'chatUpdate',
                        msgContent: { nick: playerWs.garlicName, msgContent: data.msgContent }
                    }));
                }
            });
            Session.waitingSockets.forEach( ws => { //send new msg to all players in session
                if (ws !== null) {
                    ws.send(JSON.stringify({
                        msgType: 'chatUpdate',
                        msgContent: { nick: playerWs.garlicName, msgContent: data.msgContent }
                    }));
                }
            });
        } else 
            console.log("ERROR --> chat-logic.js --> else condition(2)");
    }
    else
        console.log("ERROR --> chat-logic.js --> else condition(1)");
}