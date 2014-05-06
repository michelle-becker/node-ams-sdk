var expect     = require('chai').expect
var moment     = require('moment')
var AMSService = require('../')
var config     = require('../test-config')


var amsService
var assetId
var accessPolicyId
var locatorId

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
  
  describe('Access Policies', function () {

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

        done();

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

        done();

      })
    })

    it('should not list any access policies for the asset with out locator - cb', function (done) {

      amsService.listAssetAccessPolicies( assetId, function (err, res) {
        //console.log(err, res.body)
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
            console.log(res.body)
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

    it('should get locator for asset - cb', function (done) {

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
})
