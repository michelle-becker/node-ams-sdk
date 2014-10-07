var expect     = require('chai').expect
var AMSService = require('../')
var config     = require('../test-config')

var amsService
var assetId
var accessPolicyId

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


  describe('Access Policies', function () {

    this.timeout(5000)

    before(function (done) {

      //Create the service
      amsService = new AMSService(config.service)
      expect(amsService).to.exist

      //Create an asset - and set up token

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
})