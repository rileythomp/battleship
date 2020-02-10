// Dependencies.
const express = require('express');
const http = require('http');
const morgan = require('morgan');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;

const Game = require('./lib/Game');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
var game = Game.create();

app.set('port', PORT);
app.set('view engine', 'pug');

app.use(morgan('dev'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/shared', express.static(__dirname + '/shared'));

app.use('/', (request, response) => {
  response.render('index');
});

io.on('connection', (socket) => {
  socket.on('player-join', () => {
    if (game.clients.size == 2) {
        socket.emit('no-game-available');
        return;
    }

    game.addNewPlayer(socket);

    let numPlayers = game.clients.size;

    if (numPlayers == 1) {
      game.AlertWaitingForOtherPlayer();
    }
    else if (numPlayers == 2) {
      game.start();
    }
  });

  socket.on('disconnect', () => {
    // game.removePlayer(socket.id);
  })

  socket.on('shuffle-ships', () => {
    game.shufflePlayerShips(socket.id);
  }) 

  socket.on('begin-game', () => {
    game.playersReady += 1;
    if (game.playersReady == 1) {
      socket.emit('waiting-for-other-player-to-start');
    }
    else if (game.playersReady == 2) {
      game.begin();
    }

  });

  socket.on('player-guess', (data) => {
    game.updateBoardFromGuess(socket.id, data);
  })
});

server.listen(PORT, function() {
  console.log(`Server running on port ${PORT}...`);
});
