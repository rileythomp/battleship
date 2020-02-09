const CellStates = require('./CellStates');
const Ship = require('./Ship');

module.exports = class Board {
    constructor(id) {
        this.id = id;
        this.height = 10;
        this.width = 10;
        this.shuffleShips();
    }

    shuffleShips() {
        this.grid = [];
        for (let row = 0; row < this.height; ++row) {
            let row = [];
            for (let col = 0; col < this.width; ++col) {
                row.push(CellStates.EMPTY);
            }
            this.grid.push(row);
        }
        this.ships = [];
        this.placeShips();
    }

    placeShips() {
        for (let shipLen = 5; shipLen >= 2; --shipLen) {
            this.placeShip(shipLen);
            if (shipLen == 3) {
                this.placeShip(shipLen);
            }
        }
    }

    

    placeShip(len) {
        let shipPlaced = false;

        while (!shipPlaced) {
            shipPlaced = true;
            let orientation = Math.round(Math.random()); // 0 for horiz, 1 for vert
            let row;
            let col;

            if (orientation == 0) {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * (this.width - len + 1));

                for (let i = col; i < col + len; ++i) {
                    if (!this.grid[row][i] == CellStates.EMPTY) {
                        shipPlaced = false;
                        break;
                    }
                }

                if (shipPlaced) {
                    for (let i = col; i < col + len; ++i) {
                        this.grid[row][i] = CellStates.SHIP;
                    }

                }
            }
            else {
                row = Math.floor(Math.random() * (this.height - len + 1));
                col = Math.floor(Math.random() * 10);

                for (let i = row; i < row + len; ++i) {
                    if (!this.grid[i][col] == CellStates.EMPTY) {
                        shipPlaced = false;
                        break;
                    }
                }

                if (shipPlaced) {
                    for (let i = row; i < row + len; ++i) {
                        this.grid[i][col] = CellStates.SHIP;
                    }
                }
            }

            if (shipPlaced) {
                this.ships.push(new Ship(orientation, {row: row, col: col}, len));
            }
        }
    }
}