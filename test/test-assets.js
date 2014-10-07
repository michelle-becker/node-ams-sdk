var expect     = require('chai').expect
var AMSService = require('../')
var config     = require('../test-config')

var amsService
var assetId
var fileId

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

  describe('Assets', function (){

    this.timeout(5000)

    before(function (done){

      //Create the service
      amsService = new AMSService(config.service)
      expect(amsService).to.exist

      done()

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

    it('should list asset files - cb', function (done) {

      amsService.listAssetFiles(config.testAssetId, function (err, res){

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
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.not.be.empty

        fileId = data.d.results[0].Id
        done()

      })
    })

    it('should list asset files - stream', function (done) {

      var data = ''

      amsService.listAssetFiles(config.testAssetId)
      .on('data', function(d){
        data += d
      })
      .on('error', function (e) {
        expect(err).to.not.exist
        done()
      })
      .on('end', function () {

        expect(data).to.exist

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.not.have.property('error')
        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.not.be.empty

        done()

      })
    })

    it('should list files - cb', function (done) {

      amsService.listFiles(function (err, res){

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
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.not.be.empty

        done()

      })
    })

    it('should list files - stream', function (done) {

      var data = ''

      amsService.listFiles()
      .on('data', function(d){
        data += d
      })
      .on('error', function (e) {
        expect(err).to.not.exist
        done()
      })
      .on('end', function () {

        expect(data).to.exist

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.not.have.property('error')
        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.not.be.empty

        done()

      })
    })

    it('should get file - cb', function (done) {

      amsService.getFile(fileId, function (err, res){

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
        expect(data.d).to.have.property('Id')

        done()

      })
    })

    it('should getFile - stream', function (done) {

      var data = ''

      amsService.getFile(fileId)
      .on('data', function(d){
        data += d
      })
      .on('error', function (e) {
        expect(err).to.not.exist
        done()
      })
      .on('end', function () {

        expect(data).to.exist

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.not.have.property('error')
        expect(data).to.have.property('d')
        expect(data.d).to.have.property('Id')
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