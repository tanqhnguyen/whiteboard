var Faye = require('faye')

var bayeux = new Faye.NodeAdapter({
  mount: '/faye'
  , timeout: 120
});

module.exports = bayeux;