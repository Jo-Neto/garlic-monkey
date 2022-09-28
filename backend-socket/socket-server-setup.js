const onConnection = require('./websocket-server-setup/on-connection.js');
const onMessage = require('./websocket-server-setup/on-message.js');
const onClose = require('./websocket-server-setup/on-close.js');

function sockServSetup(wss) {
    wss.on('connection', (ws, req) => {
        onConnection(ws, req);
        ws.on('message', (data, isBinary) => onMessage(data, isBinary, ws));
        ws.on('close', () => onClose(ws));
    });
    wss.on('listening', () => { console.log('socket-server has been bound'); });
    wss.on('error', (error) => { console.log('---->>>> SOCKET-SERVER ERROR: '); console.log(error); });
};

module.exports = sockServSetup;