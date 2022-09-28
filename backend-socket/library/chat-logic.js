module.exports = function chatLogic(Session, data, playerWs) {
    if (Object.hasOwn(data, 'msgContent')) { 
        if (typeof data.msgContent === 'string') { 
            Session.chat.push({ nick: playerWs.garlicName, msgContent: data.msgContent });
            Session.activeSockets.forEach(ws => { 
                if (ws !== null && ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        msgType: 'chatUpdate',
                        msgContent: { nick: playerWs.garlicName, msgContent: data.msgContent }
                    }));
                }
            });
            Session.waitingSockets.forEach(ws => { 
                if (ws !== null && ws.readyState === 1) {
                    ws.send(JSON.stringify({
                        msgType: 'chatUpdate',
                        msgContent: { nick: playerWs.garlicName, msgContent: data.msgContent }
                    }));
                }
            });
        } 
    }
}