var expect     = require('chai').expect
var AMSService = require('../')
var config     = require('../test-config')

var amsService
var assetId

describe('AMS Service', function () {

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
  })

  describe('Assets', function (){

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

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist
          
        }
        
        expect(data).to.not.have.property('error')
        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.exist

        done()
      })
    })

    it('should list assets - cb ', function (done) {

      amsService.listAssets(function (err, res) {

        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.body).to.exist

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.not.have.property('error')
        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.exist

        done()
      })
    })

    it('should create an asset', function (done) { 
      
      amsService.createAsset(function (err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(201)

        var data = JSON.parse(res.body)
        expect(data).to.have.property('d')
        expect(data.d).to.have.keys([
          "__metadata",
          "Locators",
          "ContentKeys",
          "Files",
          "ParentAssets",
          "StorageAccount",
          "Id",
          "State",
          "Created",
          "LastModified",
          "AlternateId",
          "Name",
          "Options",
          "Uri",
          "StorageAccountName"
        ])
        expect(data.d.Name).to.be.null
        expect(data.d.AlternateId).to.be.null

        assetId = data.d.Id

        done()
      })
    })

    it('should get new asset - cb', function (done){ 
      
      amsService.getAsset(assetId, function (err, res){

        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.statusCode).to.eql(200)
        expect(res.body).to.exist

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }
        
        expect(data).to.not.have.property('error')
        expect(data).to.have.property('d')
        expect(data.d).to.have.keys([
          "__metadata",
          "Locators",
          "ContentKeys",
          "Files",
          "ParentAssets",
          "StorageAccount",
          "Id",
          "State",
          "Created",
          "LastModified",
          "AlternateId",
          "Name",
          "Options",
          "Uri",
          "StorageAccountName"
        ])
        expect(data.d.Name).to.be.null
        expect(data.d.AlternateId).to.be.null

        done()
      })
    })

    it('should get new asset - stream', function (done) {
      
      var data = ''

      amsService.getAsset(assetId)
      .on('data', function(d){

        data += d

      })
      .on('error', function(e){

        expect(e).to.not.exist
        done()

      })
      .on('end', function(){

        expect(data).to.exist

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist
          
        }
        
        expect(data).to.not.have.property('error')
        expect(data).to.have.property('d')
        expect(data.d).to.have.keys([
          "__metadata",
          "Locators",
          "ContentKeys",
          "Files",
          "ParentAssets",
          "StorageAccount",
          "Id",
          "State",
          "Created",
          "LastModified",
          "AlternateId",
          "Name",
          "Options",
          "Uri",
          "StorageAccountName"
        ])
        expect(data.d.Name).to.be.null
        expect(data.d.AlternateId).to.be.null

        done()
      })
    })

    it('should update an asset', function (done) {
      
      amsService.updateAsset(assetId, {AlternateId:"2", Name: "Test Asset"}, function (err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(204)
        expect(res.body).to.eql('')

        done()
      })
    })

    it('should get asset metadata - cb', function (done) {

      amsService.getAssetMetadata(assetId, function(err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(204)
        expect(res.body).to.eql('')

        done()
      })
    })

    it('should get asset metadata - stream', function (done) {

      var data = ''
      
      amsService.getAssetMetadata(assetId)
      .on('data', function(d){
        data += d
      })
      .on('error', function (e) {
        expect(err).to.not.exist
        done()
      })
      .on('end', function () {
        expect(data).to.eql('')
        done()
      })
    })

    it('should remove an asset', function (done) {
      amsService.removeAsset(assetId, function (err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(204)
        expect(res.body).to.eql('')

        done()
      })
    })

    it('should not get after remove - cb', function (done) {

      amsService.getAsset(assetId, function (err, res){
        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.statusCode).to.eql(404)
        expect(res.body).to.exist

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }
        
        expect(data).to.have.property('error')
        expect(data.error).to.have.keys(['code', 'message'])
        expect(data.error.message).to.have.keys(['lang', 'value'])
        expect(data.error.message.value).to.eql('Resource Asset not found')

        done()
      })
    })

    it('should not get after remove - stream', function (done) {

      var data = ''

      amsService.getAsset(assetId)
      .on('data', function(d){

        data += d

      })
      .on('error', function(e){

        expect(e).to.not.exist
        done()

      })
      .on('end', function(){

        expect(data).to.exist

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('error')
        expect(data.error).to.have.keys(['code', 'message'])
        expect(data.error.message).to.have.keys(['lang', 'value'])
        expect(data.error.message.value).to.eql('Resource Asset not found')

        done()
      })
    })

  })
})
