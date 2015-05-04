define([
  'angular'
], function(angular){
  var channel = '/whiteboard';

  var faye = function() {
    var baseUrl = window.location.protocol + '//' + window.location.host;
    var url = [baseUrl, 'faye'].join('/');

    var client = new Faye.Client(url, {
      timeout: 120,
      retry: 5
    });

    var subscription = null;

    return {
      connect: function(cb) {
        if (subscription) {
          subscription.cancel();
        }

        subscription = client.subscribe(channel, cb);
        return subscription;
      },

      publish: function(data) {
        return client.publish(channel, data);
      }
    }
  }

  return angular.module('faye', []).factory('faye', [faye])

});