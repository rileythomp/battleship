let CellStates = {
  EMPTY: 0,
  MISSED: 1,
  SHIP: 2,
  HIT_SHIP: 3,
  SUNK_SHIP: 4
}

function Game(socket) {
  this.socket = socket;
}

Game.create = function (socket) {
  return new Game(socket);
};

Game.prototype.init = function () {
  var context = this;
  $('table')[0].id = 'playerBoard';
  $('table')[1].id = 'opponentBoard';

  let that = this;
  document.getElementById('shuffle-ships').addEventListener('click', function() {
    that.socket.emit('shuffle-ships');
  });
  document.getElementById('begin-game').addEventListener('click', function() {
    document.getElementById('shuffle-ships').remove();
    document.getElementById('begin-game').remove();
    that.socket.emit('begin-game');
  })

  this.socket.on('update', function (data) {
    context.receiveGameState(data);
  });
  this.socket.on('nogameavailable', function (data) {
    // alert("nogameavailable");
  });
  this.socket.on('waitingforotherplayer', function (data) {
    // alert("waitingforotherplayer");
  });

  this.socket.on('starting', function (data) {
    displayPlayerBoard(data.playerBoard);
    displayOpponentBoard(data.opponentBoard);
  });

  this.socket.on('update-boards', function(data) {
    displayPlayerBoard(data.playerBoard);
    displayOpponentBoard(data.opponentBoard);
    if (data.playerBoard.shipsSunk == 5) {
      alert('you lose');
    }
    else if (data.opponentBoard.shipsSunk == 5) {
      alert('you win');
    }
  });

  this.socket.on('start-game', function(data) {
    for (let row = 0; row < 10; ++row) {
      for (let col = 0; col < 10; ++col) {
          let cell = document.getElementById('opponentBoard').children[0].children[row].children[col];
          cell.addEventListener('click', function() {
              if (this.classList.contains('clickable')) {
                  that.socket.emit('player-guess', {
                      row: row,
                      col: col
                  });
              }
          });
      }
    }
    updateGame(data);
  });

  this.socket.on('update-messages', function(data) {
    updateGame(data);
  })

  this.socket.emit('player-join');
};

updateGame = function(data) {
  updateOpponentBoard(data.turnToMove);
  updateMessage(data.turnToMove);
}

updateMessage = function(turnToMove) {
  if (turnToMove) {
    $('#player-instruction').html('Click where you\'d like to guess on your opponents board');
  }
  else {
    $('#player-instruction').html('Waiting for other player to guess...');
  }
}

updateOpponentBoard = function(turnToMove) {
  for (let row = 0; row < 10; ++row) {
    for (let col = 0; col < 10; ++col) {
        let cell = document.getElementById('opponentBoard').children[0].children[row].children[col];
        if (turnToMove) {
          cell.classList.add('clickable');
        }
        else {
          cell.classList.remove('clickable');
        }
    }
  }
}

displayPlayerBoard = function (board) {
  for (let row = 0; row < board.height; ++row) {
    for (let col = 0; col < board.width; ++col) {
      let tableCell = document.getElementsByClassName('board')[0].children[0].children[row].children[col];

      if (board.grid[row][col].state == CellStates.MISSED) {
        tableCell.style.backgroundColor = 'white';
      }
      else if (board.grid[row][col].state == CellStates.SHIP) {
        tableCell.style.backgroundColor = 'grey';
      }
      else if (board.grid[row][col].state == CellStates.HIT_SHIP) {
        tableCell.style.backgroundColor = 'red';
      }
      else if (board.grid[row][col].state == CellStates.SUNK_SHIP) {
        tableCell.style.backgroundColor = 'pink';
      }
      else {
        tableCell.style.backgroundColor = 'lightblue';
      }
    }
  }
}

displayOpponentBoard = function (board) {
  for (let row = 0; row < board.height; ++row) {
    for (let col = 0; col < board.width; ++col) {
      let tableCell = document.getElementsByClassName('board')[1].children[0].children[row].children[col];

      if (board.grid[row][col].state == CellStates.MISSED) {
        tableCell.style.backgroundColor = 'white';
      }
      else if (board.grid[row][col].state == CellStates.HIT_SHIP) {
        tableCell.style.backgroundColor = 'red';
      }
      else if (board.grid[row][col].state == CellStates.SUNK_SHIP) {
        tableCell.style.backgroundColor = 'pink';
      }
      else {
        tableCell.style.backgroundColor = 'lightblue';
      }
    }
  }
}