module.exports = class Ship {
    constructor(orientation, startPos, len) {
        this.orientation = orientation; // 0 for horiz, 1 for vert
        this.startPos = startPos;
        this.len = len;
    }
}