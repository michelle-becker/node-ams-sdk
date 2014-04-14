var expect     = require('chai').expect
var AMSService = require('../')
var config     = require('../test-config')

var amsService

describe('AMS Service Object', function(){

  it('should exist', function(){
    
    expect(AMSService).to.exist

  })

  it('should create new with config', function(){
    amsService = new AMSService(config)
    expect(amsService).to.exist
  })

  it('should have request property', function(){

    expect(amsService).to.have.property('request')

  })
})