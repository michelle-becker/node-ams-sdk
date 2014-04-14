var expect     = require('chai').expect
var AMSRequest = require('../lib/request')
var config     = require('../test-config')

var amsRequest

describe('AMS Request', function () {

  it('should exist', function(){
    
    expect(AMSRequest).to.exist

  })

  describe('Properties and Methods', function () {

    before(function (done) {

      //Check there is a config
      expect(config).to.exist
      done()

    })

    it('should create new request object from config', function () {

      amsRequest = new AMSRequest(config)
      expect(amsRequest).to.exist

    })

    it('should have config property', function () {

      expect(amsRequest).to.have.property('config')
      expect(amsRequest.config).to.have.property('mediaURI', "https://media.windows.net/API/")
      expect(amsRequest.config).to.have.property('tokenURI', "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13")
      expect(amsRequest.config).to.have.property('client_id', config.client_id)
      expect(amsRequest.config).to.have.property('client_secret', config.client_secret)

    })

    it('should have method to set access token', function () {

      expect(amsRequest).to.have.property('setAccessToken')

    })

    it('should set access token based on config', function (done) {

      expect(amsRequest).to.have.property('setAccessToken')
      
      amsRequest.setAccessToken(function (err, res) {

        expect(err).to.not.exist
        expect(amsRequest).to.have.property('token')
        expect(amsRequest.token).to.exist
        expect(amsRequest).to.have.property('tokenExpires')
        expect(amsRequest.tokenExpires).to.exist

        done()
      })
    })

    it('should create new request object from config with token', function () {
      //http://msdn.microsoft.com/en-us/library/azure/jj129576.aspx
      var config2 = {

        client_id     : config.client_id,
        client_secret : config.client_secret,
        access_token  : "http%3a%2f%2fschemas.xmlsoap.org%2fws%2f2005%2f05%2fidentity%2fclaims%2fnameidentifier=client_id&http%3a%2f%2fschemas.microsoft.com%2faccesscontrolservice%2f2010%2f07%2fclaims%2fidentityprovider=https%3a%2f%2fwamsprodglobal001acs.accesscontrol.windows.net%2f&Audience=urn%3aWindowsAzureMediaServices&ExpiresOn=1326498007&Issuer=https%3a%2f%2f wamsprodglobal001acs.accesscontrol.windows.net%2f&HMACSHA256=hV1WF7sTe%2ffoHqzK%2ftmnwQY22NRPaDytcOOpC9Nv4DA%3d",
        token_expires : new Date()

      }

      var amsRequest2 = new AMSRequest(config2)
      expect(amsRequest2).to.exist
      expect(amsRequest2).to.have.property('config')
      expect(amsRequest2).to.have.property('token', config2.access_token)
      expect(amsRequest2).to.have.property('tokenExpires', config2.toke_expires)
      expect(amsRequest2.config).to.have.property('mediaURI', "https://media.windows.net/API/")
      expect(amsRequest2.config).to.have.property('tokenURI', "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13")
      expect(amsRequest2.config).to.have.property('client_id', config2.client_id)
      expect(amsRequest2.config).to.have.property('client_secret', config2.client_secret)

    })

  })

})

