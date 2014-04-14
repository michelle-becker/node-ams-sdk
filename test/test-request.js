var expect     = require('chai').expect
var AMSRequest = require('../lib/request')
var config     = require('../test-config')

var amsRequest

describe('AMS Request Import', function () {

  it('should exist', function(){
    
    expect(AMSRequest).to.exist

  })

})

describe('AMS Request Object', function(){


  it('should create new request object with config', function(){

    amsRequest = new AMSRequest(config)
    expect(amsRequest).to.exist

  })

  it('should have config property', function(){

    expect(amsRequest).to.have.property('config')
    expect(amsRequest.config).to.have.property('mediaURI', "https://media.windows.net/API/")
    expect(amsRequest.config).to.have.property('tokenURI', "https://wamsprodglobal001acs.accesscontrol.windows.net/v2/OAuth2-13")
    expect(amsRequest.config).to.have.property('client_id')
    expect(amsRequest.config).to.have.property('client_secret')

  })


})