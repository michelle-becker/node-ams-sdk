var request = require('./utils/request')

var AzureRequest = function ( config ) {
  this.buildConfig(config);
}

AzureRequest.prototype.buildConfig = function ( config ) {

  this.config          = config || {}
  this.config.uri      = "https://media.windows.net/API/"
  this.config.tokenURI = "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13"

}

AzureRequest.prototype.getAccessToken = function ( cb ) {

  var options = {
    uri: this.config.tokenURI,
    method: 'POST',
    form: {client_id: this.config.client_id, client_secret: this.config.client_secret}
  }


  request.makeRequest( opitions, cb )

}


