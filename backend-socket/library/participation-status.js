const shouldStartGame = require('./should-game-start-checker.js');

module.exports = function partStatChanger(Session, data, playerWs, isWsActive) {
    if (Object.hasOwn(data, 'msgContent')) { //object has this property
        if (typeof data.msgContent === 'boolean') { //and msgContent is boolean
            if (data.msgContent === true) { //player wants to play
                //if player is alreaady on active sockets do nothing, else move to active if there's an empty place
                if (!isWsActive) { // player not on active
                    let availableIndex = Session.activeSockets.indexOf(null);
                    if (availableIndex === -1 ) { //there`s no place for the player
                        playerWs.send(JSON.stringify({
                            msgType: 'participationFeedback',
                            msgContent: {  
                                succeeded: false,
                                feedback: 'no empty place for players'
                            }
                        }));
                    } else { //there`s a place for the player
                        Session.activeSockets[availableIndex] = playerWs;
                        playerWs.send(JSON.stringify({
                            msgType: 'participationFeedback',
                            msgContent: {  
                                succeeded: true,
                                feedback: 'player succesfully placed on game'
                            }
                        }));
                        shouldStartGame(Session);
                    }
                }
            } else { //player doesn't want to play
                let firstNullIndex = Session.waitingSockets.indexOf(null); //get first null place for efficiency and performance, including pulling the socket to a closer to start of array
                if (firstNullIndex === -1 ) //no null found
                    Session.waitingSockets.push(playerWs); //send to end of array
                else 
                    Session.waitingSockets[firstNullIndex] = playerWs;
                if (isWsActive)
                    shouldStartGame(Session);
            }
        } else
            console.log("ERROR --> participation-status.js --> msgContent type error");
    }
    else
        console.log("ERROR --> participation-status.js --> msgContent property not found on received object");
}