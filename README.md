### node-ams-sdk

* Provides lightweight wrapper around Azure Media Services REST API


##### Usage 


```
//Eventually...

npm install --save node-ams-sdk

```

You initialize the service by providing a configuration object

```
var AzureService  = require('node-ams-sdk')
var serviceConfig = require('../path/to/config') || {your: config}

var amsService = new AzureService(serviceConfig)

```

If you already have your ams token, then you can specify it in your config like

```
{
    access_token: "exampletokengoeshere",
    token_expires: theDateItExpires
}
```

If you do not have this, then you will need to supply the "client_id" and "client_secrect" in your config. Before you make subsequent requests, you will need to set the access token by calling the method "setToken"

```
amsService.setToken( function (err) {
    //check for your error
    //do other stuff. no rest returned. you will not need to use the token directly
}
```
Calling this will internally set the token as in internal to the object, and it will be used on subsequent requests.

##### Azure Media Services Resources Provided

###### Assets

There are 5 methods that you can call on an assets resource. Internally, they will make the requests to Azure Media Services and return to you the response

**listAssets([query],[cb])**

Takes an optional query and optional callback

If a callback is provided, it will return an ```( err, response )``` signature. If no callback is provided, it will return a stream.


**getAsset(assetId, [query],[cb])**

Takes a required assetId and an optional query and optional callback.

If a callback is provided, it will return an ```( err, response )``` signature. If no callback is provided, it will return a stream.

**createAsset([data], cb)**

Data is and optional parameter. Asset can be created without data. It will just create an asset of Name=null. The allowable keys are

```
Name
AlternateId
ContentKeys
ParentAssets
Options
StorageAccountName
```

*AlternateId should be a string*

A callback is required. No streaming out of a create.

**updateAsset(assetId, data, cb)**

Requires an assetId, a data object, and a callback. This operation will preform a MERGE. Any parameter provided will overwrite underlying object.

```
Name
AlternateId
ContentKeys
ParentAssets
```

*AlternateId should be a string*

A callback is required. No streaming out of a create.

**removeAsset(assetId, cb)**

Requires an assetId and a callback. No streaming. 


