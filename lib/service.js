var AzureRequest = require('./request')

var AzureMediaService = function ( config ) {

  this.request = new AzureRequest(config)
  
}


AzureMediaService.prototype.createAssetLocation = function ( data, cb ) {
  
  if ( cb ){
    return this.request.post('Asset', data, cb)
  }

  return this.request.post('Asset', data)

}