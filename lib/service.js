var AzureRequest = require('./request')

var AzureMediaService = function ( config ) {

  this.request = new AzureRequest(config)

}

AzureMediaService.prototype.setToken = function (cb) {

  this.request.setAccessToken(cb)

}

AzureMediaService.prototype.getAsset = function ( assetId, query, cb ) {

  var params = query

  if (typeof(query) === 'function'  || typeof(query) === 'undefined'){
    cb = query
    params = {}
  }

  params.id = assetId

  if ( cb ) return this.request.get('Assets', params, cb)

  return this.request.get('Assets', params)

}

AzureMediaService.prototype.listAssets = function ( query, cb ) {

  var params = query

  if (typeof(query) === 'function' || typeof(query) === 'undefined'){
    cb = query
    params = {}
  }

  if ( cb ) return this.request.get('Assets', params, cb)

  return this.request.get('Assets', params)

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