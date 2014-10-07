var expect     = require('chai').expect
var moment     = require('moment')
var AMSService = require('../')
var config     = require('../test-config')

var amsService
var assetId
var locatorId

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


   describe('Locators', function(){

    this.timeout(5000)

    before(function (done) {

      //Create the service
      amsService = new AMSService(config.service)
      expect(amsService).to.exist

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
})