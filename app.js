const express = require('express');
const socket = require('socket.io');
const http = require('http');
const {Chess} = require('chess.js');
const app = express();
const path = require('path');
const { title } = require('process');
const server = http.createServer(app);
const io = socket(server);

const chess = new Chess();
let players = {};
let currentPlayers = 'W';
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
    res.render("index");
});

io.on('connection', function(uniqueSocket) {  
    console.log("Connected to server");
    if(!players.white) {
        players.white = uniqueSocket.id;
        uniqueSocket.emit('playerRole', 'w');       
    }
    else if(!players.black) {
        players.black = uniqueSocket.id;
        uniqueSocket.emit('playerRole', 'b');
    } else {
        uniqueSocket.emit('spectatorRole');
    }
     
});
server.listen(3000, () => {
    console.log("Server is running on port 3000");
}   );