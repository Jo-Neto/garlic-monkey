const express = require('express');
const router = express.Router();

const CreateGame = require('../controllers/create-game');
const JoinGame = require('../controllers/join-game');
const Draw = require('../controllers/draw');
const Chat = require('../controllers/chat');

router.post('/create-game', new CreateGame().handle.bind(new CreateGame()));    
router.get('/join-game', new JoinGame().handle.bind(new JoinGame()));
router.post('/draw', new Draw().handle.bind(new Draw()));
router.post('/chat', new Chat().handle.bind(new Chat()));


module.exports = router;