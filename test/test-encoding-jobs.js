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

  describe.skip('Encoding Job', function (){

    this.timeout(5000)

    before(function (done) {

      //Create the service
      amsService = new AMSService(config.service)
      expect(amsService).to.exist


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
  })

  describe('Chained Encoding Jobs', function () {

    this.timeout(5000)

    before(function (done) {

      //Create the service
      amsService = new AMSService(config.service)
      expect(amsService).to.exist

      amsService.getAssetMetadata(config.testAssetId, function(err, res){

        expect(err).to.not.exist
        expect(res.statusCode).to.eql(204)
        expect(res.body).to.eql('')

        done()
      })
    })

     it('should create multi task video encoding job', function (done){

      var options = {
        Name: 'Test_Chained_Video_Job',
        Chained: true,
        Tasks: [{
          Configuration:   "H264 Broadband 720p",
          OutputAssetName: 'Test_Parent_1_Output_720',
        },
        {
          Configuration:   "H264 Broadband 1080p",
          OutputAssetName: 'Test_Child_1_Output_1080',
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
        Name: 'Test_Chained_Job',
        Chained: true,
        Tasks: [{
          Configuration:   "H264 Broadband 720p",
          OutputAssetName: 'Test_Parent_2_Output_720',
        },
        {
          Configuration:   "Thumbnails",
          OutputAssetName: 'Test_Child_2_Output_Thumb',
          Value:      '00:00:05',
          Type:       'Jpeg',
          Width:     120,
          Height:    120,
        },
        {
          Configuration: "Azure Media Indexer",
          OutputAssetName: 'Test_Grandchild_2_Output_Index',
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
  })

  describe('Jobs', function (){


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

  })

  describe('Tasks', function () {

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
