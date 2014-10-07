var expect     = require('chai').expect
var AMSService = require('../')
var config     = require('../test-config')

var amsService


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

  describe('Notification Endpoints', function () {

    this.timeout(5000)

    before(function (done) {

      //Create the service
      amsService = new AMSService(config.service)
      expect(amsService).to.exist

      done()
    })

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
})