var through = require('through')
var request = require('./utils/request')

var AzureRequest = function ( config ) {

  this.buildConfig(config)

}

AzureRequest.prototype.buildConfig = function ( config ) {

  this.config          = config || {}
  this.config.mediaURI = "https://media.windows.net/API/"
  this.config.tokenURI = "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13"

  this.token           = config.access_token  || null
  this.tokenExpires    = config.token_expires || null

}

AzureRequest.prototype.setAccessToken = function ( cb ) {

  var self    = this
  var options = {
    uri:     this.config.tokenURI,
    method: 'POST',
    form:   {
      client_id:     this.config.client_id, 
      client_secret: this.config.client_secret,
      grant_type:    'client_credentials', 
      scope:         'urn:WindowsAzureMediaServices'
    }
  }

  request.makeRequest( options, function (err, res) {

    if ( err ) return cb(err)
    
    var data          = JSON.parse(res.body)
    var now           = new Date()
    self.token        = data.access_token
    self.tokenExpires = now.setSeconds(now.getSeconds + data.expires_in)

    cb(null)

  })

}

AzureRequest.prototype.get = function ( endpoint, query, cb ) {

  var options = {
    uri:            this.config.mediaURI + endpoint,
    method:         'GET',
    followRedirect: false,
    headers: {
      'Content-Type':        'application/json;odata=verbose',
      Accept:                'application/json;odata=verbose',
      DataServiceVersion:    3.0,
      MaxDataServiceVersion: 3.0,
      'x-ms-version':        2.5,
      Authorization:         'Bearer' + this.token
    }
  }

  if (query.hasOwnProperty('id')) options.uri += '(' + query.id + ')'

  if ( cb ) return request.makeRequest(options, cb)
  
  return request.streamRequest(options)
}

AzureRequest.prototype.post = function ( endpoint, data, cb ) {

  var options = {
    uri:     this.config.mediaURI + endpoint,
    method:  'POST',
    headers: {
      'Content-Type':        'application/json;odata=verbose',
      Accept:                'application/json;odata=verbose',
      DataServiceVersion:    3.0,
      MaxDataServiceVersion: 3.0,
      'x-ms-version':        2.5,
      Authorization:         'Bearer' + this.token
    },
    body: JSON.stringify(data)
  }

  return request.makeRequest(options, cb)
  
}

AzureRequest.prototype.put = function ( endpoint, data, cb ) {

  var options = {
    uri:     this.config.mediaURI + endpoint + '(' + data.id + ')',
    method:  'MERGE',
    headers: {
      'Content-Type':        'application/json;odata=verbose',
      Accept:                'application/json;odata=verbose',
      DataServiceVersion:    3.0,
      MaxDataServiceVersion: 3.0,
      'x-ms-version':        2.5,
      Authorization:         'Bearer' + this.token
    },
    body: JSON.stringify(data.properties)
  }

  return request.makeRequest(options, cb)
  
}

AzureRequest.prototype.delete = function ( endpoint, id, cb ) {

  var options = {
    uri:     this.config.mediaURI + endpoint + '(' + id + ')',
    method:  'DELETE',
    headers: {
      'Content-Type':        'application/json;odata=verbose',
      Accept:                'application/json;odata=verbose',
      DataServiceVersion:    3.0,
      MaxDataServiceVersion: 3.0,
      'x-ms-version':        2.5,
      Authorization:         'Bearer' + this.token
    }
  }

  return request.makeRequest(options, cb)
  
}

module.exports = AzureRequest