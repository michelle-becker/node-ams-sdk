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

  return this.request.get('Assets', params, cb)

}

AzureMediaService.prototype.listAssets = function ( query, cb ) {

  var params = query

  if ( typeof(query) === 'function' || typeof(query) === 'undefined' ){

    cb     = query
    params = {}

  }

  return this.request.get('Assets', params, cb)

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

AzureMediaService.prototype.updateAsset = function ( assetId, data, cb ) {

  if ( typeof(assetId)  !== 'string' ) console.log('Must supply an assetId')
  
  if ( typeof(data) === 'undefined' )  console.log('Must supply callback')
  
  if ( typeof(data) === 'function')    console.log('Must supply a data object')

  if ( typeof(cb)   === 'undefined' )  console.log('Must supply a callback')

  var properties = {
    id: assetId,
    properties: {
      Name:         data.Name,
      AlternateId:  data.AlternateId,
      ContentKeys:  data.ContentKeys,
      ParentAssets: data.ParentAssets
    }
  }

  return this.request.put('Assets', properties, cb)

}

AzureMediaService.prototype.removeAsset = function ( assetId, cb ) {

  if ( typeof(assetId) !== 'string' ) console.log('Must supply an assetId')

  if ( typeof(cb) === 'undefined' )   console.log('Must supply a callback')
  
  return this.request.delete('Assets', assetId, cb)

}

AzureMediaService.prototype.getAssetMetadata = function ( assetId, cb ) {
  
  var params = {
    qs : {
      assetid: "'" + assetId + "'"
    }
  }

  return this.request.get('CreateFileInfos', params, cb)
}

AzureMediaService.prototype.listLocators = function ( cb ) {

  return this.request.get('Locators', {}, cb)

}

AzureMediaService.prototype.getLocator = function ( locatorId, cb ) {

  var params = { id : locatorId }

  return this.request.get('Locators', params, cb)
}

AzureMediaService.prototype.listAssetLocators = function ( assetId, cb ) {

  var params = { id : assetId, secondEndpoint: 'Locators' }

  return this.request.get('Assets', params, cb)
}

module.exports = AzureMediaService