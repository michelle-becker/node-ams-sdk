var AzureRequest = require('./request')

var AzureMediaService = function ( config ) {

  this.request = new AzureRequest(config)

}

AzureMediaService.prototype.setToken = function (cb) {

  this.request.setAccessToken(cb)

}

AzureMediaService.prototype.getAsset = function ( assetId, query, cb ) {

  query.id = assetId

  if ( cb ) return this.request.get('Assets', query, cb)

  return this.request.get('Assets', query)

}

AzureMediaService.prototype.listAssets = function ( query, cb ) {
  
  if ( cb ) return this.request.get('Assets', query, cb)

  return this.request.get('Assets', query)

}

AzureMediaService.prototype.createAsset = function ( data, cb ) {
  
  var properties = {
    Name:               data.Name,
    AlternateId:        data.AlternateId,
    ContentKeys:        data.ContentKeys,
    ParentAssests:      data.Parents,
    Options:            data.Options,
    StorageAccountName: data.StorageAccountName
  }

  return this.request.post('Assets', properties, cb)
}

AzureMediaService.prototype.updateAsset = function ( id, data, cb ) {
  
  var properties = {
    id: id,
    properties: {
      Name:               data.Name,
      AlternateId:        data.AlternateId,
      ContentKeys:        data.ContentKeys,
      ParentAssests:      data.Parents
    }
  }

  return this.request.put('Assets', properties, cb)

}

AzureMediaService.prototype.deleteAsset = function ( id, cb ) {
  
  return this.request.put('Assets', id, cb)

}

module.exports = AzureMediaService