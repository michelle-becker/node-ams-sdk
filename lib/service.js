var AzureRequest = require('./request')

var AzureMediaService = function ( config ) {

  this.request = new AzureRequest(config)

}

AzureMediaService.prototype.setToken = function (cb) {

  this.request.setAccessToken(cb)

}

AzureMediaService.prototype.getAsset = function ( query, cb ) {
  
  if ( cb ) return this.request.get('Asset', query, cb)

  return this.request.get('Asset', query)

}

AzureMediaService.prototype.listAssets = function ( query, cb ) {
  
  if ( cb ) return this.request.get('Asset', query, cb)

  return this.request.get('Asset', query)

}

AzureMediaService.prototype.createAsset = function ( data, cb ) {
  
  if ( cb ) return this.request.post('Asset', data, cb)

  return this.request.post('Asset', data)

}

module.exports = AzureMediaService