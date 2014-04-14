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

    it('should create new request object with config', function () {

      amsRequest = new AMSRequest(config)
      expect(amsRequest).to.exist

    })

    it('should have config property', function () {

      expect(amsRequest).to.have.property('config')
      expect(amsRequest.config).to.have.property('mediaURI', "https://media.windows.net/API/")
      expect(amsRequest.config).to.have.property('tokenURI', "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13")
      expect(amsRequest.config).to.have.property('client_id')
      expect(amsRequest.config).to.have.property('client_secret')

    })

    it('should have method to set access token', function () {

      expect(amsRequest).to.have.property('setAccessToken')

    })

    it('should set access token based on config', function (done) {

      expect(amsRequest).to.have.property('setAccessToken')
      
      amsRequest.setAccessToken(function (err, res) {
        expect(err).to.not.exist
        expect(amsRequest).to.have.property('token')
        expect(amsRequest).to.have.property('tokenExpires')
        done()
      })
    })

  })

})

