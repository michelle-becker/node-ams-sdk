var through  = require('through')
var request  = require('./utils/request')

var AzureRequest = function ( config ) {

  this.buildConfig(config)

}

AzureRequest.prototype.buildConfig = function ( config ) {

  this.config          = config || {}
  this.config.mediaURI = "https://media.windows.net/api/"
  this.config.tokenURI = "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13"

  this.token           = config.access_token  || null
  this.tokenExpires    = config.token_expires || null

  this.defaultHeaders  = {
    'Content-Type':        'application/json;odata=verbose',
    Accept:                'application/json;odata=verbose',
    DataServiceVersion:    '3.0',
    MaxDataServiceVersion: '3.0',
    'x-ms-version':        '2.11'
  }
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

    if ( typeof data.error !== 'undefined') {
      return cb(data.error_description)
    }

    var now           = new Date()
    self.token        = data.access_token

    now.setSeconds(now.getSeconds() + Number(data.expires_in))

    self.tokenExpires = now

    cb(null)

  })
}

AzureRequest.prototype.handleRedirect = function (options, res, cb) {

  //Update the options - we want to change out the main url but save it for
  //subsequent requests
  var uri = options.uri.split(this.config.mediaURI)[1]

  this.config.mediaURI = res.headers.location

  options.uri = this.config.mediaURI + uri

  if ( cb ) return request.makeRequest(options, cb)

  return request.streamRequest(options)
}


AzureRequest.prototype.makeRequest = function (options, cb) {

  var self = this
  var now  = new Date()

  if ( !self.token || now > self.tokenExpires ) {

    self.setAccessToken(function (err) {

      if ( err ) return cb(err)

      //Reset token
      options.headers.Authorization = 'Bearer ' + self.token
      request.makeRequest(options, cb)

    })

  } else {

    //Set token
    options.headers.Authorization = 'Bearer ' + self.token
    request.makeRequest(options, cb)

  }

}


AzureRequest.prototype.get = function ( endpoint, query, cb ) {

  var self    = this
  var options = {
    uri:            this.config.mediaURI + endpoint,
    method:         'GET',
    followRedirect: false,
    headers:        this.defaultHeaders
  }


  if ( query.hasOwnProperty('id') ) options.uri += "('" + query.id + "')"

  if ( query.hasOwnProperty('secondEndpoint') ) options.uri += "/" + query.secondEndpoint

  if ( query.hasOwnProperty('qs') ) options.qs = query.qs

  //Redirect for callbacks
  if ( cb ) return self.makeRequest(options, function (err, res) {

    if ( err ) return cb(err)

    if ( res.statusCode === 301 ) return self.handleRedirect(options, res, cb)

    return cb(err, res)

  })

  //How to handle redirect logic for streams
  var now = new Date()
  var s   = through()
  var r

  if ( !self.token || now > self.tokenExpires ) {

    self.setAccessToken(function (err) {

      if ( err ) return console.log(err)

      //Reset token
      options.headers.Authorization = 'Bearer ' + self.token

      r = request.streamRequest(options)

      r.on('error', r.emit.bind(s, 'error'))

      r.on('response', function (res) {

        //We want to forward error events
        if ( res.statusCode === 301 ) {

          var r2 = self.handleRedirect(options, res)

          return r2.on('error', r2.emit.bind(s, 'error')).pipe(s)

        }

        r.pipe(s)

      })

    })

  } else {

    //Set token
    options.headers.Authorization = 'Bearer ' + self.token

    r = request.streamRequest(options)

    r.on('error', r.emit.bind(s, 'error'))

    r.on('response', function (res) {

      //We want to forward error events
      if ( res.statusCode === 301 ) {

        var r2 = self.handleRedirect(options, res)

        return r2.on('error', r2.emit.bind(s, 'error')).pipe(s)

      }

      r.pipe(s)

    })

  }

  return s

}

AzureRequest.prototype.post = function ( endpoint, data, cb ) {

  var self    = this
  var options = {
    uri:     this.config.mediaURI + endpoint,
    method:  'POST',
    headers: this.defaultHeaders,
    body:    JSON.stringify(data)
  }


  return self.makeRequest(options, function(err, res){

    if ( err ) return cb(err)

    if ( res.statusCode === 301 ) return self.handleRedirect(options, res, cb)

    return cb(err, res)

  })

}

AzureRequest.prototype.put = function ( endpoint, data, cb ) {

  var self    = this
  var options = {
    uri:     this.config.mediaURI + endpoint + "('" + data.id + "')",
    method:  'MERGE',
    headers: this.defaultHeaders,
    body:    JSON.stringify(data.properties)
  }


  return self.makeRequest(options, function(err, res){

    if ( err ) return cb(err)

    if ( res.statusCode === 301 ) return self.handleRedirect(options, res, cb)

    return cb(err, res)

  })

}

AzureRequest.prototype.delete = function ( endpoint, id, cb ) {

  var self    = this
  var options = {
    uri:     this.config.mediaURI + endpoint + "('" + id + "')",
    method:  'DELETE',
    headers: this.defaultHeaders
  }


  return self.makeRequest(options, function(err, res){

    if ( err ) return cb(err)

    if ( res.statusCode === 301 ) return self.handleRedirect(options, res, cb)

    return cb(err, res)

  })

}

module.exports = AzureRequest