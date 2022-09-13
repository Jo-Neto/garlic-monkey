//checks if ws belongs to session, return -1 if not, return 2 if belongs to active sockets array, returns 1 if socket belongs to waiting line, returns null if session does not exist

module.exports = function wsBelongsChecker(Session, ws) {
    if (Session.isFinished) //TODO: remove this check
        return null;
    let foundIndex = Session.activeSockets.findIndex( (el) => { return (el === ws ? true : false ) } );
    if (foundIndex === -1) { //socket does not belong to active sockets
        if (Session.waitingSockets.findIndex( (el) => { return (el === ws ? true : false ) } ) ) { //check if belongs to waiting sockets then
            return 1;
        } else //does not belong to both active sockets and waiting sockets
            return -1;
    } else //socket belongs to active sockets
        return 2;
}