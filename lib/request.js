var request = require('./utils/request')

var AzureRequest = function ( config ) {
  this.buildConfig(config)
}

AzureRequest.prototype.buildConfig = function ( config ) {

  this.config          = config || {}
  this.config.mediaURI = "https://media.windows.net/API/"
  this.config.tokenURI = "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13"

}

AzureRequest.prototype.setAccessToken = function ( cb ) {

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


  request.makeRequest( opitions, function (err, res) {
    if (err) {
      return cb(err)
    }

    var now           = new Date()
    this.token        = res.access_token
    this.tokenExpires = now.setSeconds(now.getSeconds + res.expires_in)
    cb(null)
  })

}

AzureRequest.prototype.post = function ( endpoint, data, cb ) {

  var options = {
    uri:     this.config.mediaURI + endpoint,
    method:  'POST',
    headers: {
      'Content-Type': 'application/json;odata=verbose',
      Accept: 'application/json;odata=verbose',
      DataServiceVersion: 3.0,
      MaxDataServiceVersion: 3.0,
      'x-ms-version': 2.5,
      Authorization: Bearer + this.token
    },
    body: JSON.stringify(data)
  }

  if (cb) {
    return request.makeRequest(options, cb)
  }

  return request.streamRequest(options)
}

module.exports = AzureRequest