Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

$(document).ready(function() {
  $('.close').click(function() {
    $('#modal').hide();
  })
  $('button').hide();
  var socket = io();

  var game = Game.create(socket);
  game.init();
});