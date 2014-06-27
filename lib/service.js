var AzureRequest = require('./request')

var AzureMediaService = function ( config ) {

  this.request = new AzureRequest(config)
  this.MediaProcessorId = config.MediaProcessorId || 'nb:mpid:UUID:70bdc2c3-ebf4-42a9-8542-5afc1e55d217' //Azure Media Encoder http://msdn.microsoft.com/en-us/library/azure/dn673582.aspx

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

  if ( typeof(data) === 'undefined' || typeof(data) === 'function' || typeof(cb) !== 'function' ) console.log('Must supply data object and callback')

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

  if ( typeof(cb) !== 'function' ) console.log('Must supply a callback')

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

AzureMediaService.prototype.createLocator = function ( data, cb ) {

  if ( typeof(data) === 'undefined' || typeof(data) === 'function' ) console.log('Must supply data object and callback')

  var properties = {
    AccessPolicyId:     data.AccessPolicyId,
    AssetId:            data.AssetId,
    StartTime:          data.StartTime,
    Type:               data.Type,
    Name:               data.Name,
    ExpirationDateTime: data.ExpirationDateTime,
  }

  return this.request.post('Locators', properties, cb)

}

AzureMediaService.prototype.updateLocator = function ( locatorId, data, cb ) {

  if ( typeof(locatorId)  !== 'string' ) console.log('Must supply a locatorId')

  if ( typeof(data) === 'undefined' || typeof(data) === 'function' || typeof(cb) !== 'function' ) console.log('Must supply data object and callback')

  var properties = {
    id: locatorId,
    properties : {
      StartTime:          data.StartTime,
      Name:               data.Name,
      ExpirationDateTime: data.ExpirationDateTime
    }
  }

  return this.request.put('Locators', properties, cb)

}

AzureMediaService.prototype.removeLocator = function ( locatorId, cb ) {

  if ( typeof(locatorId) !== 'string' ) console.log('Must supply a locatorId')

  if ( typeof(cb) !== 'function' ) console.log('Must supply a callback')

  return this.request.delete('Locators', locatorId, cb)

}

AzureMediaService.prototype.listAccessPolicies = function ( cb ) {

  return this.request.get('AccessPolicies', {}, cb)

}

AzureMediaService.prototype.getAccessPolicy = function ( accessPolicyId, cb ) {

  var params = { id : accessPolicyId }

  return this.request.get('AccessPolicies', params, cb)

}

AzureMediaService.prototype.listAssetAccessPolicies = function ( assetId, cb ) {

  var params = { id : assetId, secondEndpoint: 'AccessPolicies' }

  return this.request.get('Assets', params, cb)

}

AzureMediaService.prototype.createAccessPolicy = function ( data, cb ) {

  if ( typeof(data) === 'undefined' || typeof(data) === 'function' || typeof(cb) !== 'function' ) console.log('Must supply data object and callback')

  var properties = {
    Name:               data.Name,
    DurationInMinutes:  data.DurationInMinutes,
    Permissions:        data.Permissions
  }

  return this.request.post('AccessPolicies', properties,  cb)

}

AzureMediaService.prototype.removeAccessPolicy = function ( accessPolicyId, cb ) {

  if ( typeof(accessPolicyId) !== 'string' ) console.log('Must supply an accessPolicyId')

  if ( typeof(cb) !== 'function' ) console.log('Must supply a callback')

  return this.request.delete('AccessPolicies', accessPolicyId, cb)

}

AzureMediaService.prototype._buildTaskXML = function ( options, inc ) {

  function template ( input, data ) {

    return input.replace(/\{%(\w*)%\}/g, function ( m, key ) { return data.hasOwnProperty(key) ? data[key] : "" } )
  }

  var task

  if ( options.Configuration === 'Thumbnails' ){

    if ( !("Width" in options) || !("Height" in options) || !("Type" in options) || !("Value" in options)) console.log('Please submit a width, height, type, and value for thumbnail generation.')

    task = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Thumbnail Size=\"{%Width%},{%Height%}\" Type=\"{%Type%}\" Filename=\"{OriginalFilename}_{Size}_{ThumbnailTime}_{ThumbnailIndex}_{Date}_{Time}.{DefaultExtension}\"><Time Value=\"{%Value%}\""

    if ( options.hasOwnProperty('Step')) task += " Step=\"{%Step%}\""

    if ( options.hasOwnProperty('Stop')) task += " Stop=\"{%Stop%}\""

    task += "/></Thumbnail>"

  } else {

    options.inc = inc || 0

    task = "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset assetName=\"{%OutputAssetName%}\">JobOutputAsset({%inc%})</outputAsset></taskBody>"

  }

  return template(task, options)
}

AzureMediaService.prototype.createEncodingJob = function ( assetId, options, cb ) {

  if ( typeof(assetId) !== 'string' ) console.log('Must supply an assetId')

  if ( !(options instanceof Object) || typeof(options) === 'function' || typeof(cb) !== 'function' ) console.log('Must supply options object and callback')

  var self = this

  this.getAsset(assetId, function (err, res){

    if ( err || res.statusCode !== 200 ) return cb(err || JSON.parse(res.body))

    var asset = JSON.parse(res.body).d

    if ( options.Configuration === 'Thumbnails' ) {

      options.Configuration = self._buildTaskXML(options)

    }

    var data = {
      Name:                         options.Name,
      InputMediaAssets:             [{__metadata: {uri: asset.__metadata.uri}}],
      JobNotificationSubscriptions: options.JobNotificationSubscriptions,
      Tasks: [{
        Configuration:    options.Configuration,
        MediaProcessorId: self.MediaProcessorId,
        TaskBody:         self._buildTaskXML(options)
      }]
    }
    console.log(data)
    return self.request.post('Jobs', data, cb)

  })

}

AzureMediaService.prototype.createMultiTaskJob = function ( assetId, options, cb ) {

  if ( typeof(assetId) !== 'string' ) console.log('Must supply an assetId')

  if ( !(options instanceof Object) || typeof(options) === 'function' || typeof(cb) !== 'function' ) console.log('Must supply options object and callback')

  var self = this

  this.getAsset(assetId, function (err, res){

    if ( err || res.statusCode !== 200 ) return cb(err || JSON.parse(res.body))

    var asset = JSON.parse(res.body).d
    var inc   = 0
    var data  = {
      Name:                         options.Name,
      InputMediaAssets:             [{__metadata: {uri: asset.__metadata.uri}}],
      JobNotificationSubscriptions: options.JobNotificationSubscriptions,
      Tasks: []
    }

    options.Tasks.forEach(function (task) {

      if ( task.Configuration === 'Thumbnails' ) {

        task.Configuration = self._buildTaskXML(task)

      }

      data.Tasks.push({
        Configuration:    task.Configuration,
        MediaProcessorId: self.MediaProcessorId,
        TaskBody:         self._buildTaskXML(task, inc)
      })

      inc ++

    })

    return self.request.post('Jobs', data, cb)

  })

}

AzureMediaService.prototype.getJob = function ( jobId, cb ) {

  var params = { id : jobId }

  return this.request.get('Jobs', params, cb)

}

AzureMediaService.prototype.getJobStatus = function ( jobId, cb ) {

  var params = { id : jobId, secondEndpoint: 'State' }

  return this.request.get('Jobs', params, cb)

}

AzureMediaService.prototype.getJobTasks = function ( jobId, cb ) {

  var params = { id : jobId, secondEndpoint: 'Tasks' }

  return this.request.get('Jobs', params, cb)

}

AzureMediaService.prototype.getTaskOutput = function ( taskId, cb ) {

  var params = { id : taskId, secondEndpoint: 'OutputMediaAssets' }

  return this.request.get('Tasks', params, cb)

}

AzureMediaService.prototype.getNotificationEndpoint = function ( endpointId, cb ) {

  var params = { id: endpointId }

  return this.request.get('NotificationEndPoints', params, cb)

}

AzureMediaService.prototype.listNotificationEndpoints = function ( cb ) {

  return this.request.get('NotificationEndPoints', {}, cb)

}

AzureMediaService.prototype.createNotificationEndpoint = function ( data, cb ) {

  if ( typeof(data) === 'undefined' || typeof(data) === 'function' || typeof(cb) !== 'function' ) console.log('Must supply data object and callback')

  var properties = {
    Name:             data.Name,
    EndPointType:     1, //AzureQueue
    EndPointAddress:  data.EndPointAddress
  }

  return this.request.post('NotificationEndPoints', properties, cb)

}

AzureMediaService.prototype.updateNotificationEndpoint = function ( endpointId, data, cb ) {

  if ( typeof(endpointId) !== 'string' ) console.log('Must supply an endpoint Id')

  if ( typeof(data) === 'undefined' || typeof(data) === 'function' || typeof(cb) !== 'function' ) console.log('Must supply data object and callback')

  var properties = {
    id:         endpointId,
    properties: {
      Name: data.Name
    }
  }

  return this.request.put('NotificationEndPoints', properties, cb)

}

AzureMediaService.prototype.removeNotificationEndpoint = function ( endpointId, cb ) {

  if ( typeof(endpointId) !== 'string' || typeof(cb) !== 'function') console.log('Must supply an endpointId and a callback')

  return this.request.delete('NotificationEndPoints', endpointId, cb)

}

module.exports = AzureMediaService