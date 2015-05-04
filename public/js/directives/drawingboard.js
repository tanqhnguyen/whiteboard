define([
  'angular'
  , 'text!templates/drawingboard.html'
], function(angular, template){

  var directive = function($window, drawing) {
    return {
      link: function($scope, $element, $attr) {
        $element.attr('id', 'content');

        var canvas = $element.find('canvas')[0];

        var contexts = {};
        var getOrCreateCanvasContext = function(color) {
          var c = contexts[color];
          if (c) {
            return c;
          }

          c = {
            context: canvas.getContext('2d'),
            color: color
          };

          contexts[color] = c;

          return c;
        }

        drawing.on('create', function(e, color){
          getOrCreateCanvasContext(color);
        });

        drawing.on('start', function(e, color, x, y){
          var c = getOrCreateCanvasContext(color);
          c.started = true;
          c.context.beginPath();
          c.context.moveTo(x, y);
        });

        drawing.on('move', function(e, color, x, y){
          var c = getOrCreateCanvasContext(color);
          if (!c.started) {
            return;
          }

          c.context.lineTo(x,y);

          c.context.strokeStyle = c.color;
          c.context.lineWidth = 5;

          c.context.stroke();
        });

        drawing.on('stop', function(e, color){
          var c = getOrCreateCanvasContext(color);
          c.started = false;
        });


        $scope.width = function() {
          return $window.innerWidth;
        }

        $scope.height = function() {
          return $window.innerHeight;
        }

        var mouseDown = false;
        $scope.onMouseDown = function(e) {
          mouseDown = true;
          var x = e.pageX;
          var y = e.pageY-44;
          $scope.mouseDown({x: x, y: y});
        }

        $scope.onMouseMove = function(e) {
          if (mouseDown) {
            var x = e.pageX;
            var y = e.pageY-44;
            $scope.mouseMove({x: x, y: y});
          }
        }

        $scope.onMouseUp = function() {
          mouseDown = false;
          $scope.mouseUp();
        }
      },
      scope: {
        'color': '=',
        'mouseDown': '&',
        'mouseMove': '&',
        'mouseUp': '&'
      },
      template: template
    };
  }

  return angular.module('drawingboard', []).directive('drawingboard', ['$window', 'drawing', directive]);
});