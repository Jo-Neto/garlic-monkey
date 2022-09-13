const onConnection = require('./websocket-server/on-connection.js');
const onMessage = require('./websocket-server/on-message.js');

function sockServSetup(wss) {
    wss.on('connection', (ws, req) => {
        onConnection(ws, req);
        ws.on('message', (data, isBinary) => onMessage(data, isBinary, ws));
        ws.on('close', () => console.log("ws closed"))
    });
    wss.on('listening', () => { console.log('socket-server has been bound'); });
    wss.on('error', (error) => { console.log('---->>>> SOCKET-SERVER ERROR: '); console.log(error); });
    wss.on('close', () => { console.log('socket-server has been closed'); });
};

//TODO: broadcaster checker
module.exports = sockServSetup;





//https://localhost:9999/
//const socket11 = new WebSocket("wss://localhost:9999",['room1','p11']);
//socket11.send(JSON.stringify({'msgType': 'chatNew', 'msgContent': 'hahahahahaahaha'}));

/*
socket11.onmessage = (event) => {
    console.log('received message from '+ this);
    console.log(event.data);
}
*/