Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

$(document).ready(function() {
  var socket = io();

  var game = Game.create(socket);
  game.init();
});