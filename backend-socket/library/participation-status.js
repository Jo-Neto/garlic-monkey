const shouldStartGame = require('./should-game-start-checker.js');

module.exports = function partStatChanger(Session, data, playerWs) {
    if (Object.hasOwn(data, 'msgContent')) { //object has this property
        if (typeof data.msgContent === 'boolean') { //and msgContent is boolean
            if (playerWs.isUndecidedOldPlayer) {
                playerWs.isUndecidedOldPlayer = false;
                let allActivePlayersName = Session.activeSockets.map(webs => { if (webs !== null) return webs.garlicName; });
                let allWaitingPlayersName = Session.waitingSockets.map(webs => { if (webs !== null) return webs.garlicName; });
                if (playerWs !== null && playerWs.readyState === 1) {
                    playerWs.send(JSON.stringify({
                        msgType: 'playerRow',
                        msgContent: { activeNick: allActivePlayersName, waitingNick: allWaitingPlayersName }
                    }));
                }
            }
            if (data.msgContent === true) { //player wants to play
                //if player is alreaady on active sockets do nothing, else move to active if there's an empty place
                if (playerWs.aID === null) { // player not on active
                    let availableIndex = Session.activeSockets.indexOf(null);
                    if (availableIndex === -1 && playerWs.readyState === 1) { //there`s no place for the player
                        playerWs.send(JSON.stringify({
                            msgType: 'participationFeedback',
                            msgContent: {
                                succeeded: false,
                                feedback: 'no empty place for players'
                            }
                        }));
                    } else { //there`s a place for the player
                        Session.activeSockets[availableIndex] = playerWs;
                        Session.waitingSockets[Session.waitingSockets.indexOf(playerWs)] = null;
                        playerWs.aID = availableIndex;
                        if (playerWs.readyState === 1) {
                            playerWs.send(JSON.stringify({
                                msgType: 'participationFeedback',
                                msgContent: {
                                    succeeded: true,
                                    feedback: 'player succesfully placed on game'
                                }
                            }));
                        }
                        shouldStartGame(Session);
                        Session.activeSockets.forEach(webs => { //send new msg to all players in session
                            if (webs !== null && webs.readyState === 1) {
                                webs.send(JSON.stringify({
                                    msgType: 'playerUpdate',
                                    msgContent: { nick: playerWs.garlicName, updateType: 'in', isOnGame: playerWs.aID}
                                }));
                            }
                        });
                        Session.waitingSockets.forEach(webs => { //send new msg to all players in session
                            if (webs !== null && webs.readyState === 1) {
                                webs.send(JSON.stringify({
                                    msgType: 'playerUpdate',
                                    msgContent: { nick: playerWs.garlicName, updateType: 'in', isOnGame: playerWs.aID}
                                }));
                            }
                        });
                    }
                } else {
                    if (playerWs.readyState === 1) {
                        playerWs.send(JSON.stringify({
                            msgType: 'participationFeedback',
                            msgContent: {
                                succeeded: false,
                                feedback: 'player already placed on game'
                            }
                        }));
                    }
                }
            } else { //player doesn't want to play
                if (playerWs.aID !== null) {
                    let firstNullIndex = Session.waitingSockets.indexOf(null); //get first null place for efficiency and performance
                    if (firstNullIndex === -1) //no null found
                        Session.waitingSockets.push(playerWs); //send to end of array
                    else
                        Session.waitingSockets[firstNullIndex] = playerWs;
                    Session.activeSockets[playerWs.aID] = null;
                    playerWs.aID = null;
                    shouldStartGame(Session);
                    if (playerWs.readyState === 1) {
                        playerWs.send(JSON.stringify({
                            msgType: 'participationFeedback',
                            msgContent: {
                                succeeded: true,
                                feedback: 'player succesfully placed out of game'
                            }
                        }));
                    }
                    Session.activeSockets.forEach(webs => { //send new msg to all players in session
                        if (webs !== null && webs.readyState === 1) {
                            webs.send(JSON.stringify({
                                msgType: 'playerUpdate',
                                msgContent: { nick: playerWs.garlicName, updateType: 'out', isOnGame: playerWs.aID}
                            }));
                        }
                    });
                    Session.waitingSockets.forEach(webs => { //send new msg to all players in session
                        if (webs !== null && webs.readyState === 1) {
                            webs.send(JSON.stringify({
                                msgType: 'playerUpdate',
                                msgContent: { nick: playerWs.garlicName, updateType: 'out', isOnGame: playerWs.aID}
                            }));
                        }
                    });
                } else {
                    if (playerWs.readyState === 1) {
                        playerWs.send(JSON.stringify({
                            msgType: 'participationFeedback',
                            msgContent: {
                                succeeded: false,
                                feedback: 'player is already out of the game'
                            }
                        }));
                    }
                }
            }
        } 
    }
}