define([
  'angular'
], function(angular){

  var drawing = function($rootScope) {
    var scope = $rootScope.$new(true);
    return {
      on: function(e, cb) {
        scope.$on(e, cb);
      },
      trigger: function() {
        var args = Array.prototype.slice.apply(arguments);
        scope.$broadcast.apply(scope, args)
      }
    };
  }

  return angular.module('drawing', []).factory('drawing', ['$rootScope', drawing])

});