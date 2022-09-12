const onConnection = require('./websocket-server/on-connection.js');
const onMessage = require('./websocket-server/on-message.js');

function sockServSetup(wss) {
    wss.on('connection', (ws, req) => {
        onConnection(ws, req);
        ws.on('message', (data, isBinary) => onMessage(data, isBinary, ws));
    });
    wss.on('listening', () => { console.log('socket-server has been bound'); });
    wss.on('error', (error) => { console.log('---->>>> SOCKET-SERVER ERROR: '); console.log(error); });
    wss.on('close', () => { console.log('socket-server has been closed'); });
};

module.exports = sockServSetup;
//https://localhost:9999/
//const socket = new WebSocket("wss://localhost:9999", ["roomname", "nick_name", "pass_word"]);
//socket.send('');