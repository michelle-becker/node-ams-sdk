var expect     = require('chai').expect
var moment     = require('moment')
var AMSService = require('../')
var config     = require('../test-config')

describe('AMS Service', function () {

  before(function () {

    expect(config).to.exist
    expect(config.service).to.exist
    expect(config.service.client_id).to.exist
    expect(config.service.client_secret).to.exist
    expect(config.testAssetId).to.exist
    expect(config.testQueueName).to.exist

  })

  it('should exist', function(){

    expect(AMSService).to.exist

  })

  describe('Instantiation', function(){

    before(function(done){

      //Check there is a config
      expect(config).to.exist
      done()

    })

    it('should create new serice with config', function(){

      amsService = new AMSService(config.service)
      expect(amsService).to.exist

    })

    it('should have request property', function(){

      expect(amsService).to.have.property('request')

    })

    it('should set the access token', function (done){

      amsService.setToken(function (err) {

        expect(err).to.not.exist
        expect(amsService.request.token).to.exist
        expect(amsService.request.tokenExpires).to.exist

        done()

      })
    })
  })
})