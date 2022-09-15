const onConnection = require('./websocket-server/on-connection.js');
const onMessage = require('./websocket-server/on-message.js');
const onClose = require('./websocket-server/on-close.js');

function sockServSetup(wss) {
    wss.on('connection', (ws, req) => {
        onConnection(ws, req);
        ws.on('message', (data, isBinary) => onMessage(data, isBinary, ws));
        ws.on('close', () => onClose(ws));
    });
    wss.on('listening', () => { console.log('socket-server has been bound'); });
    wss.on('error', (error) => { console.log('---->>>> SOCKET-SERVER ERROR: '); console.log(error); });
};

//TODO: broadcaster checker
module.exports = sockServSetup;



//https://localhost/
//const socket11 = new WebSocket("wss://localhost:9999",['room1','p11']);
//socket11.send(JSON.stringify({'msgType': 'chatNew', 'msgContent': 'hahahahahaahaha'}));

/*
socket11.onmessage = (event) => {
    console.log('received message from '+ this);
    console.log(event.data);
}
*/