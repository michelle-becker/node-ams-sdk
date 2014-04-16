var AzureRequest = require('./request')

var AzureMediaService = function ( config ) {

  this.request = new AzureRequest(config)

}

AzureMediaService.prototype.setToken = function (cb) {

  this.request.setAccessToken(cb)

}

AzureMediaService.prototype.getAsset = function ( assetId, query, cb ) {

  var params = query

  if ( typeof(query) === 'function'  || typeof(query) === 'undefined' ){

    cb     = query
    params = {}

  }

  params.id = assetId

  if ( cb ) return this.request.get('Assets', params, cb)

  return this.request.get('Assets', params)

}

AzureMediaService.prototype.listAssets = function ( query, cb ) {

  var params = query

  if ( typeof(query) === 'function' || typeof(query) === 'undefined' ){

    cb     = query
    params = {}

  }

  if ( cb ) return this.request.get('Assets', params, cb)

  return this.request.get('Assets', params)

}

AzureMediaService.prototype.createAsset = function ( data, cb ) {

  if ( typeof(data) === 'undefined' ) console.log('Must supply data object and callback')
  
  if ( typeof(data) === 'function') {

    cb   = data
    data = {}

  } 

  var properties = {
    Name:               data.Name,
    AlternateId:        data.AlternateId,
    ContentKeys:        data.ContentKeys,
    ParentAssets:       data.ParentAssets,
    Options:            data.Options,
    StorageAccountName: data.StorageAccountName
  }

  return this.request.post('Assets', properties, cb)
}

AzureMediaService.prototype.updateAsset = function ( id, data, cb ) {

  if ( typeof(id)  !== 'string' )     console.log('Must supply an id')
  
  if ( typeof(data) === 'undefined' ) console.log('Must supply callback')
  
  if ( typeof(data) === 'function')   console.log('Must supply a data object')

  if ( typeof(cb)   === 'undefined' ) console.log('Must supply a callback')

  var properties = {
    id: id,
    properties: {
      Name:         data.Name,
      AlternateId:  data.AlternateId,
      ContentKeys:  data.ContentKeys,
      ParentAssets: data.ParentAssets
    }
  }

  return this.request.put('Assets', properties, cb)

}

AzureMediaService.prototype.removeAsset = function ( id, cb ) {

  if ( typeof(id) !== 'string' )    console.log('Must supply an id')

  if ( typeof(cb) === 'undefined' ) console.log('Must supply a callback')
  
  return this.request.delete('Assets', id, cb)

}

module.exports = AzureMediaService