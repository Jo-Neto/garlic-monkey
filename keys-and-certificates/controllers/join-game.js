class JoinGame {
    handle (req, res){
        console.log('Join Game Controller');
        res.json({msg: "Join Game"});
    }
}

module.exports = JoinGame;