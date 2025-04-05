const express = require('express');
const socket = require('socket.io');
const http = require('http');
const {Chess} = require('chess.js');
const app = express();
const path = require('path');
const { title } = require('process');
const server = http.createServer(app);
const io = socket(server);
const ejs = require('ejs');

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
    uniqueSocket.on('disconnect', function() {
        console.log("Disconnected from server");
        if(uniqueSocket.id == players.white) {
            delete players.white;
        } else if(uniqueSocket.id == players.black) {
            delete players.black;
        }
    })
    uniqueSocket.on('move', function(move) {
        try {
            if(chess.turn()==='w'&& uniqueSocket.id !== players.white)return;
            if(chess.turn()==='b'&& uniqueSocket.id !== players.black)return;
            const result = chess.move(move);
            if(result) {
                console.log(move);
                currentPlayers = chess.turn();
                io.emit('move', move);
                io.emit('board', chess.fen());
            } else {
                uniqueSocket.emit('invalidMove', move);
            }
        }
        catch(err) {
            console.log(err);
        }
    });

});
server.listen(3000, () => {
    console.log("Server is running on port 3000");
}   );