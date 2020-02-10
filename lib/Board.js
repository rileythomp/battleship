const CellStates = require('./CellStates');
const Ship = require('./Ship');

module.exports = class Board {
    constructor(id) {
        this.id = id;
        this.height = 10;
        this.width = 10;
        this.shipsSunk = 0;
        this.shuffleShips();
    }

    shuffleShips() {
        this.grid = [];
        for (let row = 0; row < this.height; ++row) {
            let row = [];
            for (let col = 0; col < this.width; ++col) {
                row.push({state: CellStates.EMPTY, shipIndex: -1});
            }
            this.grid.push(row);
        }
        this.ships = [];
        this.placeShips();
    }

    placeShips() {
        for (let shipLen = 5; shipLen >= 2; --shipLen) {
            this.placeShip(shipLen, -1*shipLen + 5);
        }
        this.placeShip(3, 4);
    }

    

    placeShip(len, shipIndex) {
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
                    if (!this.grid[row][i].state == CellStates.EMPTY) {
                        shipPlaced = false;
                        break;
                    }
                }

                if (shipPlaced) {
                    for (let i = col; i < col + len; ++i) {
                        this.grid[row][i] = {state: CellStates.SHIP, shipIndex: shipIndex};
                    }

                }
            }
            else {
                row = Math.floor(Math.random() * (this.height - len + 1));
                col = Math.floor(Math.random() * 10);

                for (let i = row; i < row + len; ++i) {
                    if (!this.grid[i][col].state == CellStates.EMPTY) {
                        shipPlaced = false;
                        break;
                    }
                }

                if (shipPlaced) {
                    for (let i = row; i < row + len; ++i) {
                        this.grid[i][col] = {state: CellStates.SHIP, shipIndex: shipIndex};
                    }
                }
            }

            if (shipPlaced) {
                this.ships.push(new Ship(orientation, {row: row, col: col}, len, shipIndex));
            }
        }
    }
}