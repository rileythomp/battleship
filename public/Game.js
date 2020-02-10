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

  this.socket.on('other-player-quit', function() {
    for (let row = 0; row < 10; ++row) {
      for (let col = 0; col < 10; ++col) {
        let cell = document.getElementById('opponentBoard').children[0].children[row].children[col];
        cell.classList.remove('clickable');
      }
	}
	showModal('Uh oh, the other player has quit theh game. Refresh to start a new game', 9000);
	$('#player-instruction').html('');
	$('button').hide();
  })

  this.socket.on('no-game-available', function () {
    $('.boards').hide();
    $('h2').html('Sorry, there aren\'t any games available at the moment, please try again later.');
  });
  this.socket.on('waiting-for-player', function () {
    $('#player-instruction').html('Waiting for other player to join...');
  });

  this.socket.on('starting', function (data) {
    $('button').show();
    $('#player-instruction').html('')
    displayPlayerBoard(data.playerBoard);
    displayOpponentBoard(data.opponentBoard);
  });

  this.socket.on('update-boards', function(data) {
    displayPlayerBoard(data.playerBoard);
    displayOpponentBoard(data.opponentBoard);
    if (data.playerBoard.shipsSunk == 5) {
      showModal('Oh no! Your opponent sunk all your battleships so you\'ve lost the game.', 9000);
      $('#player-instruction').html('');
    }
    else if (data.opponentBoard.shipsSunk == 5) {
      showModal('Congrats! You sunk all your opponent\'s battleships and won the game!', 9000);
      $('#player-instruction').html('');
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

  this.socket.on('ship-was-sunk', function() {
    showModal('Oh no! Your ship was sunk!', 3000);
  })

  this.socket.on('sunk-ship', function() {
    showModal('Good job, you sunk a ship!', 3000);
  })

  this.socket.on('update-messages', function(data) {
    updateGame(data);
  })

  this.socket.on('waiting-for-other-player-to-start', function() {
    $('#player-instruction').html('Waiting for other play to start the game...');
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
        tableCell.style.border = '2px solid darkblue';
      }
      else if (board.grid[row][col].state == CellStates.SHIP) {
        tableCell.style.backgroundColor = 'grey';
        tableCell.style.border = '2px double black';
      }
      else if (board.grid[row][col].state == CellStates.HIT_SHIP) {
        tableCell.style.backgroundColor = 'red';
        tableCell.style.border = '2px double black';
      }
      else if (board.grid[row][col].state == CellStates.SUNK_SHIP) {
        tableCell.style.backgroundColor = 'black';
        tableCell.style.border = '2px double black';
      }
      else {
        tableCell.style.backgroundColor = 'lightblue';
        tableCell.style.border = '2px solid darkblue';
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
        tableCell.classList.remove('clickable');
      }
      else if (board.grid[row][col].state == CellStates.HIT_SHIP) {
        tableCell.style.backgroundColor = 'red';
        tableCell.classList.remove('clickable');
      }
      else if (board.grid[row][col].state == CellStates.SUNK_SHIP) {
        tableCell.style.backgroundColor = 'black';
        tableCell.classList.remove('clickable');
        tableCell.style.border = '2px double black';
      }
      else {
        tableCell.style.backgroundColor = 'lightblue';
      }
    }
  }
}

showModal = function(msg, delay) {
  $('#modal-text').html(msg);
  $('#modal').show();
  setTimeout(function() {
    $('#modal').hide();
  }, delay)
}