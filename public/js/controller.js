define([
  'app'
], function(app){
  const CONNECTED = 'connected';
  const MOUSEDOWN = 'mousedown';
  const MOUSEMOVE = 'mousemove';
  const MOUSEUP = 'mouseup';

  var Controller = function(faye, drawing) {
    var self = this;
    this.color = "#"+((1<<24)*Math.random()|0).toString(16);

    faye.connect(function(message){
      if (message.color == self.color) {
        return;
      }

      switch(message.event) {
        case CONNECTED:
          drawing.trigger('create', message.color);
          break;
        case MOUSEDOWN:
          drawing.trigger('start', message.color, message.x, message.y);
          break;
        case MOUSEMOVE:
          drawing.trigger('move', message.color, message.x, message.y);
          break;
        case MOUSEUP:
          drawing.trigger('stop', message.color);
          break;
        default: break;
      }

    }).then(function(){
      return faye.publish({
        event: CONNECTED,
        color: self.color
      });
    }).then(function(result){

    });

    this.onMouseDown = function(x, y) {
      drawing.trigger('start', self.color, x, y);

      faye.publish({
        event: MOUSEDOWN,
        x: x,
        y: y,
        color: self.color
      });
    }

    this.onMouseMove = function(x, y) {
      drawing.trigger('move', self.color, x, y);
      faye.publish({
        event: MOUSEMOVE,
        x: x,
        y: y,
        color: self.color
      }); 
    }

    this.onMouseUp = function() {
      drawing.trigger('stop', self.color);
      faye.publish({
        event: MOUSEUP,
        color: self.color
      });
    }
  }

  app.controller('MainController', ['faye', 'drawing', Controller]);
});