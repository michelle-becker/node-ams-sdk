var AzureRequest = require('./request')

var AzureMediaService = function ( config ) {

  this.request = new AzureRequest(config)

}

AzureMediaService.prototype.setToken = function (cb) {

  this.request.setAccessToken(cb)

}

AzureMediaService.prototype.getAsset = function ( data, cb ) {
  
  if ( cb ) return this.request.get('Asset', data, cb)

  return this.request.get('Asset', data)

}

AzureMediaService.prototype.listAssets = function ( data, cb ) {
  
  if ( cb ) return this.request.get('Asset', data, cb)

  return this.request.get('Asset', data)

}

AzureMediaService.prototype.createAsset = function ( data, cb ) {
  
  if ( cb ) return this.request.post('Asset', data, cb)

  return this.request.post('Asset', data)

}

module.exports = AzureMediaService