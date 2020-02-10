// A ship will be an array of coordinates

module.exports = class Ship {

    // orientation 0 for horiz, 1 for vert
    constructor(orientation, startPos, len, index) {
        this.coords = [];
        this.index = index;
        this.timesHit = 0;
        this.len = len;
        
        if (orientation == 0) {
            for (let col = startPos.col; col < startPos.col + len; ++col) {
                this.coords.push({row: startPos.row, col: col})
            }
        }
        else {
            for (let row = startPos.row; row < startPos.row + len; ++row) {
                this.coords.push({row: row, col: startPos.col})
            }
        }
    }
}