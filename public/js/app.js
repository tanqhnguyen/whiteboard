define([
  'angular'
  , 'directives/drawingboard'
  , 'services/faye'
  , 'services/drawing'
], function(angular){
  return angular.module('whiteboard', ['drawingboard', 'faye', 'drawing']);
});