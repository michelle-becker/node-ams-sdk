var expect     = require('chai').expect
var moment     = require('moment')
var AMSService = require('../')
var config     = require('../test-config')


var amsService
var assetId
var fileId
var accessPolicyId
var locatorId
var jobId
var taskId
var endpointId

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

  describe('Assets', function (){

    this.timeout(5000)

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

  describe('Access Policies', function () {

    this.timeout(5000)

    before(function (done) {

      //Create an asset

      amsService.createAsset(function (err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(201)

        var data = JSON.parse(res.body)

        assetId = data.d.Id

        done()

      })

    })

    after(function (done) {

      // Remove an asset

      amsService.removeAsset(assetId, function (err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(204)
        expect(res.body).to.eql('')

        done()

      })

    })

    it('should create an access policy', function (done) {

      var accessPolicy = {
        Name: 'Test',
        DurationInMinutes: 60
      }

      amsService.createAccessPolicy(accessPolicy, function (err, res) {

        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.statusCode).to.eql(201)
        expect(res.body).to.exist

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.keys([
          "__metadata",
          "Id",
          "Created",
          "LastModified",
          "Name",
          "DurationInMinutes",
          "Permissions"
        ])

        accessPolicyId = data.d.Id

        done()

      })
    })

    it('should list all access policies - cb', function (done){

      amsService.listAccessPolicies(function (err, res) {

        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.exist

        done()

      })
    })

    it('should list all access policies - stream', function (done){

      var data = ''

      amsService.listAccessPolicies()
      .on('data', function(d){
        data += d
      })
      .on('error', function(e){
        expect(e).to.not.exist
      })
      .on('end', function(){

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.exist

        done()

      })
    })

    it('should get an access policy - cb', function (done){

      amsService.getAccessPolicy( accessPolicyId, function (err, res) {

        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.keys([
          "__metadata",
          "Id",
          "Created",
          "LastModified",
          "Name",
          "DurationInMinutes",
          "Permissions"
        ])

        done()

      })
    })

    it('should get an access policy - stream', function (done){

      var data = ''

      amsService.getAccessPolicy(accessPolicyId)
      .on('data', function(d){
        data += d
      })
      .on('error', function(e){
        expect(e).to.not.exist
      })
      .on('end', function(){

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.keys([
          "__metadata",
          "Id",
          "Created",
          "LastModified",
          "Name",
          "DurationInMinutes",
          "Permissions"
        ])

        done()

      })
    })

    it('should not list any access policies for the asset with out locator - cb', function (done) {

      amsService.listAssetAccessPolicies( assetId, function (err, res) {

        expect(err).to.not.exist
        expect(res).to.exist

        expect(res.statusCode).to.eql(404)

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('error')
        expect(data.error).to.have.property('message')
        expect(data.error.message.value).to.eql("Resource not found for the segment \'AccessPolicies\'.")

        done()

      })
    })

    it('should remove an accessPolicy', function (done) {

      amsService.removeAccessPolicy(accessPolicyId, function (err, res) {

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(204)

        done()

      })
    })

  })

  describe('Locators', function(){

    this.timeout(5000)

    before(function (done) {

      //Create an asset

      amsService.createAsset(function (err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(201)

        var data = JSON.parse(res.body)
        assetId  = data.d.Id

        var accessPolicy = { Name: 'Test', DurationInMinutes: 60, Permissions: 1 }

        amsService.createAccessPolicy(accessPolicy, function (err, res) {

          expect(err).to.not.exist
          expect(res.statusCode).to.eql(201)

          var data        = JSON.parse(res.body)
          accessPolicyId  = data.d.Id

          done()

        })
      })

    })

    after(function (done) {

      // Remove an asset

      amsService.removeLocator(locatorId, function (err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(204)

        amsService.removeAccessPolicy(accessPolicyId, function (err, res) {

          expect(err).to.not.exist
          expect(res.statusCode).to.eql(204)

          amsService.removeAsset(assetId, function (err, res){

            expect(err).to.not.exist

            expect(res.statusCode).to.eql(204)

            done()

          })
        })
      })

    })

    it('should create a locator for an asset and access policy', function (done) {

      var expires = new Date()
      expires.setMinutes(expires.getMinutes() + 10)

      var locator = {
        AccessPolicyId:     accessPolicyId,
        AssetId:            assetId,
        StartTime:          moment.utc().format('MM/DD/YYYY hh:mm:ss A'),
        Type:               2,
        Name:               'TestLocator',
        ExpirationDateTime: moment.utc().add('d', 1).format('MM/DD/YYYY hh:mm:ss A')
      }

      amsService.createLocator(locator, function (err, res){

        expect(err).to.not.exist
        expect(res).to.exist

        expect(res.statusCode).to.eql(201)

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data).to.not.have.property('error')
        expect(data.d).to.have.keys([
          '__metadata',
          'AccessPolicy',
          'Asset',
          'Id',
          'ExpirationDateTime',
          'Type',
          'Path',
          'BaseUri',
          'ContentAccessComponent',
          'AccessPolicyId',
          'AssetId',
          'StartTime',
          'Name'
        ])

        locatorId = data.d.Id

        done()

      })
    })

    it('should list locators - cb', function (done) {

      amsService.listLocators(function (err, res) {

        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.not.be.empty

        done()

      })
    })

    it('should list locators - stream', function (done) {

      var data = ''

      amsService.listLocators()
      .on('data', function(d){
        data += d
      })
      .on('error', function(e){
        expect(e).to.not.exist
      })
      .on('end', function(){

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.not.be.empty

        done()

      })
    })

    it('should get locator - cb', function (done) {

      amsService.getLocator(locatorId, function (err, res) {

        expect(err).to.not.exist
        expect(res).to.exist

        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data).to.not.have.property('error')
        expect(data.d).to.have.keys([
          '__metadata',
          'AccessPolicy',
          'Asset',
          'Id',
          'ExpirationDateTime',
          'Type',
          'Path',
          'BaseUri',
          'ContentAccessComponent',
          'AccessPolicyId',
          'AssetId',
          'StartTime',
          'Name'
        ])

        done()

      })
    })

    it('should get locator - stream', function (done) {

      var data = ''

      amsService.getLocator(locatorId)
      .on('data', function(d){
        data += d
      })
      .on('error', function(e){
        expect(e).to.not.exist
      })
      .on('end', function(){

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data).to.not.have.property('error')
        expect(data.d).to.have.keys([
          '__metadata',
          'AccessPolicy',
          'Asset',
          'Id',
          'ExpirationDateTime',
          'Type',
          'Path',
          'BaseUri',
          'ContentAccessComponent',
          'AccessPolicyId',
          'AssetId',
          'StartTime',
          'Name'
        ])

        done()

      })
    })

    it('should list locators for asset - cb', function (done) {

      amsService.listAssetLocators(assetId, function (err, res){

        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.not.be.empty

        done()

      })
    })

    it('should list locators for asset - stream', function (done) {

      var data = ''

      amsService.listAssetLocators(assetId)
      .on('data', function(d){
        data += d
      })
      .on('error', function(e){
        expect(e).to.not.exist
      })
      .on('end', function(){

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.not.be.empty

        done()

      })
    })

    it('should update locator', function (done) {

      amsService.updateLocator(locatorId, {Name: 'New Name'}, function (err, res){

        expect(err).to.not.exist
        expect(res).to.exist
        expect(res.statusCode).to.eql(204)

        done()

      })
    })
  })

  describe('Notification Endpoints', function () {

    this.timeout(5000)

    it('should list notification endpoints - cb', function (done) {

      amsService.listNotificationEndpoints(function (err, res) {

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')

        done()
      })
    })

    it('should list notification endpoints - stream', function (done) {

      var data = ''

      amsService.listNotificationEndpoints()
      .on('data', function(d){
        data += d
      })
      .on('error', function(e){
        expect(e).to.not.exist
      })
      .on('end', function(){

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results).to.exist

        done()

      })
    })

    it('should create notification endpoint', function (done) {

      var notificationEndpoint = {
        Name:            'TestEndpoint',
        EndPointAddress: config.testQueueName
      }

      amsService.createNotificationEndpoint(notificationEndpoint, function (err, res){

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(201)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('Id')

        endpointId = data.d.Id

        done()

      })
    })

    it('should get new notification endpoint - cb', function (done) {

      amsService.getNotificationEndpoint(endpointId, function (err, res){

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('Id')

        endpointId = data.d.Id

        done()

      })

    })

    it('should get new notification endpoint - stream', function (done) {

      var data = ''

      amsService.getNotificationEndpoint(endpointId)
      .on('data', function(d){
        data += d
      })
      .on('error', function(e){
        expect(e).to.not.exist
      })
      .on('end', function(){

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('Id')
        expect(data.d.Name).to.eql('TestEndpoint')

        done()

      })
    })

    it('should update notification endpoint', function (done) {

      var notificationEndpoint = {
        Name: 'TestEndpoint2'
      }

      amsService.updateNotificationEndpoint(endpointId, notificationEndpoint, function (err, res){

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(204)

        done()

      })
    })

    it('should get updated notification endpoint - stream', function (done) {

      var data = ''

      amsService.getNotificationEndpoint(endpointId)
      .on('data', function(d){
        data += d
      })
      .on('error', function(e){
        expect(e).to.not.exist
      })
      .on('end', function(){

        try {
          data = JSON.parse(data)

        } catch (e){
          expect(e).to.not.exist

        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('Id')
        expect(data.d.Name).to.eql('TestEndpoint2')

        done()

      })
    })

    it('should remove notification endpoint', function (done) {

      amsService.removeNotificationEndpoint(endpointId, function (err, res){

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(204)

        done()

      })
    })

    it('should not get deleted notification endpoint', function (done) {

      amsService.getNotificationEndpoint(endpointId, function (err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(404)
        done()

      })

    })

  })

  describe('Encoding Job', function (){

    this.timeout(5000)

    before(function (done) {

      //Create an asset

      amsService.getAssetMetadata(config.testAssetId, function(err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(204)
        expect(res.body).to.eql('')

        var notificationEndpoint = {
          Name:            'TestJobEndpoint2',
          EndPointAddress: config.testQueueName
        }

        amsService.createNotificationEndpoint(notificationEndpoint, function (err, res){

          expect(err).to.not.exist
          expect(res.body).to.exist
          expect(res.statusCode).to.eql(201)

          try {
            var data = JSON.parse(res.body)
          } catch (err) {
            expect(err).to.not.exist
          }

          expect(data).to.have.property('d')
          expect(data.d).to.have.property('Id')

          endpointId = data.d.Id

          done()

        })

      })

    })

    after( function (done) {

      amsService.removeNotificationEndpoint(endpointId, function (err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(204)
        done()

      })

    })


    it('should create a video encoding job', function (done){

      var options = {
        Name:            'Test_1_Job',
        Configuration:   "H264 Broadband 720p",
        OutputAssetName: 'Test_1_Output_720'
      }

      amsService.createEncodingJob(config.testAssetId, options, function (err, res) {

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(201)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property("InputMediaAssets")
        expect(data.d).to.have.property('Tasks')

        done()

      })
    })

    it.skip('should create a video encoding job with notification subscription', function (done){

      var options = {
        Name:            'Test_1_Job',
        Configuration:   "H264 Broadband 720p",
        OutputAssetName: 'Test_1_Output_720',
        JobNotificationSubscriptions: [{
          TargetJobState: 1,
          NotificationEndPointId: endpointId
        }]
      }

      amsService.createEncodingJob(config.testAssetId, options, function (err, res) {

        expect(err).to.not.exist
        expect(res.body).to.exist

        expect(res.statusCode).to.eql(201)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property("InputMediaAssets")
        expect(data.d).to.have.property('Tasks')

        done()

      })
    })

    it('should create a thumbnails job', function (done){

      var options = {
        Name:            'Test_1_Job_Thumb',
        OutputAssetName: 'Test_1_Output_Thumb',
        OutputFileName:  'ThumbnailFile',
        Configuration:   'Thumbnails',
        Value:           '00:00:05',
        Width:           120,
        Height:          120,
        Type:            'Jpeg'
      }

      amsService.createEncodingJob(config.testAssetId, options, function (err, res) {

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(201)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property("InputMediaAssets")
        expect(data.d).to.have.property('Tasks')
        expect(data.d).to.have.property('Id')

        // set the jobId
        jobId = data.d.Id

        done()

      })
    })

    it('should create an indexer job', function (done) {

      var options = {
        Name:            'Test_Index_Job',
        OutputAssetName: 'Test_Video_Index',
        Configuration:   'Azure Media Indexer',
        Title:           'name of video or audio',
        Description:     'should be descriptive of video'
      }

      amsService.createEncodingJob(config.testAssetId, options, function (err, res) {

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(201)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property("InputMediaAssets")
        expect(data.d).to.have.property('Tasks')
        expect(data.d).to.have.property('Id')

        done()

      })
    })

    it.skip('should create a thumbnails job with notification subscription', function (done){

      var options = {
        Name:            'Test_1_Thumb_2',
        OutputAssetName: 'Test_1_Output_Thumb_2',
        Configuration:   'Thumbnails',
        JobNotificationSubscriptions: {
          TargetJobState: 1,
          NotificationEndPointId: endpointId
        },
        Value:    '00:00:05',
        Width:     200,
        Height:    200,
        Type:     'Jpeg'
      }

      amsService.createEncodingJob(config.testAssetId, options, function (err, res) {

        expect(err).to.not.exist
        expect(res.body).to.exist

        expect(res.statusCode).to.eql(201)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property("InputMediaAssets")
        expect(data.d).to.have.property('Tasks')
        expect(data.d).to.have.property('Id')

        // set the jobId
        jobId = data.d.Id

        done()

      })
    })

    it('should create multi task video encoding job', function (done){

      var options = {
        Name: 'Test_2_Job',
        Tasks: [{
          Configuration:   "H264 Broadband 720p",
          OutputAssetName: 'Test_2_Output_720',
        },
        {
          Configuration:   "H264 Broadband 1080p",
          OutputAssetName: 'Test_2_Output_1080',
        }]
      }

      amsService.createMultiTaskJob(config.testAssetId, options, function (err, res) {

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(201)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property("InputMediaAssets")
        expect(data.d).to.have.property('Tasks')
        expect(data.d).to.have.property('Id')

        done()

      })
    })

    it('should create multi task video encoding and thumbnail job and indexer', function (done){

      var options = {
        Name: 'Test_3_Job',
        Tasks: [{
          Configuration:   "H264 Broadband 720p",
          OutputAssetName: 'Test_3_Output_720',
        },
        {
          Configuration:   "Thumbnails",
          OutputAssetName: 'Test_3_Output_Thumb',
          Value:      '00:00:05',
          Type:       'Jpeg',
          Width:     120,
          Height:    120,
        },
        {
          Configuration: "Azure Media Indexer",
          OutputAssetName: 'Test_3_Output_Index',
          Title:           'name of video or audio',
          Description:     'should be descriptive of video'
        }]
      }

      amsService.createMultiTaskJob(config.testAssetId, options, function (err, res) {

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(201)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property("InputMediaAssets")
        expect(data.d).to.have.property('Tasks')
        expect(data.d).to.have.property('Id')

        done()

      })
    })

    it('should get the job', function (done) {

      amsService.getJob(jobId, function (err, res){

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property("State")
        expect(data.d).to.have.property('Tasks')
        expect(data.d).to.have.property('Id')

        done()

      })

    })

    it('should get the job status', function (done){

      amsService.getJobStatus(jobId, function (err, res){

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property("State")

        done()

      })
    })

    it('should get the job tasks', function (done){

      amsService.getJobTasks(jobId, function (err, res){

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')

        taskId = data.d.results[0].Id
        done()

      })
    })

    it('should get the task output assets', function (done){

      amsService.getTaskOutput(taskId, function (err, res){

        expect(err).to.not.exist
        expect(res.body).to.exist
        expect(res.statusCode).to.eql(200)

        try {
          var data = JSON.parse(res.body)
        } catch (err) {
          expect(err).to.not.exist
        }

        expect(data).to.have.property('d')
        expect(data.d).to.have.property('results')
        expect(data.d.results[0]).to.have.property('Uri')
        done()

      })
    })
  })
})
