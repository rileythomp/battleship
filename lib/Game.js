const HashMap = require('hashmap');
const Board = require('./Board');
const CellStates = require('./CellStates');

function Game() {
  this.clients = new HashMap();
  this.board1;
  this.board2;
  this.playersReady = 0;
  this.curPlayerId;
}

Game.create = function() {
  return new Game();
};

Game.prototype.addNewPlayer = function(socket, data) {
  this.clients.set(socket.id, socket);
};

Game.prototype.removePlayer = function(id) {
  this.clients.remove(id);
}

Game.prototype.shufflePlayerShips = function(id) {
  if (id == this.board1.id) {
    this.board1.shuffleShips();
  }
  else {
    this.board2.shuffleShips();
  }
  
  var ids = this.clients.keys();

  for (let i = 0; i < ids.length; ++i) {
    if (ids[i] == this.board1.id) {
      playerBoard = this.board1;
      opponentBoard = this.board2;
    }
    else {
      playerBoard = this.board2;
      opponentBoard = this.board1;
    }

    this.clients.get(ids[i]).emit('update-boards', {
      playerBoard: playerBoard,
      opponentBoard: opponentBoard
    });
  }
}

Game.prototype.updateBoardFromGuess = function(id, data) {
  let playerBoard;
  let opponentBoard;
  let row = data.row;
  let col = data.col;
  if (id == this.board1.id) {
    if (this.board2.grid[row][col] == CellStates.SHIP) {
      this.board2.grid[row][col] = CellStates.HIT_SHIP;
    }
    else if (this.board2.grid[row][col] == CellStates.EMPTY) {
      this.board2.grid[row][col] = CellStates.MISSED;
    }
  }
  else {
    if (this.board1.grid[row][col] == CellStates.SHIP) {
      this.board1.grid[row][col] = CellStates.HIT_SHIP;
    }
    else if (this.board1.grid[row][col] == CellStates.EMPTY) {
      this.board1.grid[row][col] = CellStates.MISSED;
    }
  }

  this.curPlayerId = (this.clients.keys()[0] == this.curPlayerId ? this.clients.keys()[1] : this.clients.keys()[0]);
  var ids = this.clients.keys();

  for (let i = 0; i < ids.length; ++i) {
    if (ids[i] == this.board1.id) {
      playerBoard = this.board1;
      opponentBoard = this.board2;
    }
    else {
      playerBoard = this.board2;
      opponentBoard = this.board1;
    }

    this.clients.get(ids[i]).emit('update-boards', {
      playerBoard: playerBoard,
      opponentBoard: opponentBoard
    });

    let turnToMove = playerBoard.id == this.curPlayerId;
    this.clients.get(ids[i]).emit('update-messages', {
      turnToMove: turnToMove
    })
  }
}

Game.prototype.begin = function() {
  var ids = this.clients.keys();
  this.curPlayerId = this.clients.keys()[0];

  for (let i = 0; i < ids.length; ++i) {
    let playerBoard;
    let opponentBoard;
    if (ids[i] == this.board1.id) {
      playerBoard = this.board1;
      opponentBoard = this.board2;
    }
    else {
      playerBoard = this.board2;
      opponentBoard = this.board1;
    }
    let turnToMove = playerBoard.id == this.curPlayerId;
    this.clients.get(ids[i]).emit('start-game', {
      playerBoard: playerBoard,
      opponentBoard: opponentBoard,
      turnToMove: turnToMove
    });
  }
}

Game.prototype.AlertWaitingForOtherPlayer = function() {
  var ids = this.clients.keys();
  for (var i = 0; i < ids.length; ++i) {
    this.clients.get(ids[i]).emit('waitingforotherplayer', {
      name: 12321
    });
  }
};

Game.prototype.start = function() {
  var ids = this.clients.keys();

  this.board1 = new Board(ids[0]);
  this.board2 = new Board(ids[1]);

  for (let i = 0; i < ids.length; ++i) {
    if (ids[i] == this.board1.id) {
      playerBoard = this.board1;
      opponentBoard = this.board2;
    }
    else {
      playerBoard = this.board2;
      opponentBoard = this.board1;
    }

    this.clients.get(ids[i]).emit('starting', {
      playerBoard: playerBoard,
      opponentBoard: opponentBoard
    });
  }
};

module.exports = Game;