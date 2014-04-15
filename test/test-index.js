var expect     = require('chai').expect
var AMSService = require('../')
var config     = require('../test-config')

var amsService
var assestId

describe('AMS Service', function () {

  it('should exist', function(){
    
    expect(AMSService).to.exist

  })

  describe('Properties and Methods', function(){

    before(function(done){

      //Check there is a config
      expect(config).to.exist
      done()

    })

    it('should create new serice with config', function(){

      amsService = new AMSService(config)
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

    it('should list assets - cb ', function (done) {

      amsService.listAssets(function (err, res) {

        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.body).to.exist

        done()
      })
    })

    it('should list assets - stream ', function (done) {

      var data = ''

      amsService.listAssets()
      .on('data', function(d){
        data += d
      })
      .on('error', function(e){
        expect(e).to.not.exist
        done()
      })
      .on('end', function(){
        expect(data).to.exist
        done()
      })
    })



  })
})
