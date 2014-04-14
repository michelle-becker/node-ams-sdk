var expect     = require('chai').expect
var AMSService = require('../')
var config     = require('../test-config')

var amsService

describe('AMS Service Import', function () {

  it('should exist', function(){
    
    expect(AMSService).to.exist

  })

})

describe('AMS Service Object', function(){


  it('should create new serice with config', function(){

    amsService = new AMSService(config)
    expect(amsService).to.exist

  })

  it('should have request property', function(){

    expect(amsService).to.have.property('request')

  })


})