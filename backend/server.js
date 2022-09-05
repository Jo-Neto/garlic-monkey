const express = require('express');
const cors = require('cors');
const app = express();
const port = 8080;
const game = require('./routes/game');

app.use(cors({
    origin: 'https://localhost:3000',
    credentials: 'include'
}));
app.use(game);

app.listen(port, () => {
    console.log(`Backend is listening to the port `, port);
});