var request = require('request')

exports.makeRequest = function ( options, cb ) {
  request(options, cb)
}

