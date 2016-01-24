node-ams-sdk
============

Provides lightweight wrapper around Azure Media Services REST API


## Usage


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

If you do not have this, then you will need to supply the "client_id" and "client_secrect" in the config. Before you make subsequent requests, you will need to set the access token by calling the method "setToken"

```
amsService.setToken( function (err) {
    //check for error
    //do other stuff. no response returned.
}
```
Calling this will set the token as in internal property to be used on subsequent requests.

## Azure Media Services Resources Provided


### Assets
-----------

There are 5 methods that you can call on an assets resource. Internally, they will make the requests to Azure Media Services and return to you the response

####listAssets([query],[cb])

Takes an optional query and optional callback

If a callback is provided, it will return an ```( err, response )``` signature. If no callback is provided, it will return a stream.


####getAsset(assetId, [query],[cb])

Takes a required assetId and an optional query and optional callback.

If a callback is provided, it will return an ```( err, response )``` signature. If no callback is provided, it will return a stream.

####createAsset([data], cb)

Data is and optional parameter. Asset can be created without data. It will just create an asset of Name=null. The allowable keys are

* **Name**
* **AlternateId** - _String_
* **ContentKeys**
* **ParentAssets**
* **Options**
* **StorageAccountName**


A callback is required. No streaming out of a create.

####updateAsset(assetId, data, cb)

Requires an assetId, a data object, and a callback. This operation will preform a MERGE. Any parameter provided will overwrite underlying object.


* **Name**
* **AlternateId** - _String_
* **ContentKeys**
* **ParentAssets**


A callback is required. No streaming out of a create.

####removeAsset(assetId, cb)

Requires an assetId and a callback. No streaming.

####getAssetMetadata(assetId, [cb])

Requires an assetId. Callback is optional. Will stream without callback. Will link up the data that is in blob storage to the supplied asset. If it works, this will return a status code of 204 with no data.

####listAssetFiles(assetId, [cb])

Will list the files in an asset storage container. Requires an assetId. Callback is optional. Will stream without callback.

####listAssetFiles(assetId, [cb])

Will list the files in an asset storage container. Requires an assetId. Callback is optional. Will stream without callback.

####getFile(fileId, [cb])

Will get the file information for the given id. Requires fileId. Callback is optional. Will stream without callback.

####listFiles([cb])

Will list all of the files in the container. Pretty nifty. Again, Callback optional, be prepared to handle streams.


### Access Policies
---------------------

####listAccessPolicies([cb])

Takes an optional callback. Will list all access policies - streaming if no cb.

####listAssetAccessPolicies(assetId, [cb])

Requires an assetId, Optional callback. Will list all access policies for a given asset - streaming if no cb.

####getAccessPolicy(accessPolicyId, [cb])

Requires an accessPolicyId, Optional callback. Will return details about selected access policy - streaming if no cb.

####createAccessPolicy(data, cb)

Requires data and callback. Will create a new access policy. Allowed data properties are:

* **Name**
* **DurationInMinutes**
* **Permissions**


####removeAccessPolicy(accessPolicyId, cb)

Requires accessPolicyId, and callback. Will remove existing access policy.

### Locators
-------------

####listLocators([cb])

Takes an optional callback. Will list all locators - streaming if no cb.

####listAssetLocators(assetId, [cb])

Requires an assetId, Optional callback. Will list all locators for a given asset - streaming if no cb.

####getLocator(locatorId, [cb])

Requires an locatorId, Optional callback. Will return details about selected locator - streaming if no cb.

####createLocator(data, cb)

Requires data and callback. Will create a new locator. Allowed data properties are:


* **AccessPolicyId**
* **AssetId**
* **StartTime** - (Format: 'MM/DD/YYYY hh:mm:ss A')
* **Type**
* **Name**
* **ExpirationDateTime** - (Format: 'MM/DD/YYYY hh:mm:ss A')


####updateLocator(locatorId, data, cb)

Requires locatorId, data, and callback. Will upate an exisiting locator. Allowed data properties are:


* **StartTime** - (Format: 'MM/DD/YYYY hh:mm:ss A')
* **Name**
* **ExpirationDateTime** - (Format: 'MM/DD/YYYY hh:mm:ss A')


####removeLocator(locatorId, cb)

Requires a locatorId and a callback. Will remove selected locator


### Media Processors
-----------

####listMediaProcessors(cb)

Will list all of the available media processor ids. You can reset the internal value of MediaProcessorId directly, or via a config to one of the ids returned by this call. This will be your default processor id. Will stream if no callback.

### Encoding Job
-----------------

####createEncodingJob(assetId, options, cb)

Requires an assetId of the asset to be encoded, an options object, and a callback. Will create an encoding job for given asset. Options are as follows:

* **Name**             - The name of the job
* **Configuration**    - String representation of encoding e.g. "H264 Broadband 720p"
* **OutputAssetName**  - The name of the output asset

_if Configuration is 'Thumbnails', these extra parameters are required_

* **Value**   - The timecode of the time the thumbnail is to be taken
* **Type**    - The type of image for the output. Allowed: "MemoryBMP"; "Bmp"; "Emf"; "Wmf"; "Gif"; "Jpeg"; "Png"; "Tiff"; "Exif"; "Icon"
* **Width**   - int32 value of the output width
* **Height**  - int32 value of the height

_optional thumbnail arguments_

* **Step** - A string value that describes the time increments in a video at which a thumbnail will be generated
* **Stop** - A string value that describes the end time of the sequence of thumbnails
* **OutputFileName** - A string value that can be used for the output blob name - default is the template

_if Configuration is 'Azure Media Indexer', these extra parameters are required_

* **Title** - A descriptive title of the media to be indexed
* **Description** - A description of the media to be indexed. This should be as descriptive as possbile and include any difficult words or key words the media may include.


##### Example

```
var options = {
  Name:            'Test_1',
  Configuration:   'H264 Broadband 720p',
  OutputAssetName: 'Test_1_Output_1'
}

or

var options = {
  Name:            'Test_1_Thumb',
  OutputAssetName: 'Test_1_Output_Thumb',
  OutputFIleName:  'Test_Thumb',
  Configuration:   'Thumbnails',
  Value:           '00:00:05',
  Width:           120,
  Height:          120,
  Type:            'Jpeg'
}
```


####createMultiTaskJob(assetId, options, cb)

Requires an assetId of the asset to be encoded, an options object, and a callback. Will create an encoding job with multiple tasks for given asset. Options are as follows:


* **Name**       - The name of the job
* **Chained**    - Boolean true or false. If not provided, defaults to false. Will chain the tasks so they run in the order specified in the Tasks array.
* **Tasks**      - An array of tasks options - each of with has the following properties:

    * **Configuration**    - String representation of encoding e.g. "H264 Broadband 720p"
    * **OutputAssetName**  - The name of the output asset

    _if Configuration is 'Thumbnails', these extra parameters are required_

    * **Value**   - The timecode of the time the thumbnail is to be taken
    * **Type**    - The type of image for the output. Allowed: "MemoryBMP"; "Bmp"; "Emf"; "Wmf"; "Gif"; "Jpeg"; "Png"; "Tiff"; "Exif"; "Icon"
    * **Width**   - int32 value of the output width
    * **Height**  - int32 value of the height

    _optional thumbnail arguments_

    * **Step** - A string value that describes the time increments in a video at which a thumbnail will be generated
    * **Stop** - A string value that describes the end time of the sequence of thumbnail
    * **OutputFileName** - A string value that can be used for the output blob name - default is the template

    _if Configuration is 'Azure Media Indexer', these extra parameters are required_

    * **Title** - A descriptive title of the media to be indexed
    * **Description** - A description of the media to be indexed. This should be as descriptive as possbile and include any difficult words or key words the media may include.


##### Example

```
var options = {

  Name: 'Test_3',
  Tasks: [{
    Configuration:   'H264 Broadband 720p',
    OutputAssetName: 'Test_3_Output_1',
  },
  {
    Configuration:   'Thumbnails',
    OutputAssetName: 'Test_3_Output_Thumb',
    OutputFileName:  'Test_Thumbnail',
    Value:           '00:00:05',
    Type:            'Jpeg',
    Width:           120,
    Height:          120,
  }]
}
```

####getJob(jobId, [cb])

Requires a jobId. Will return all information for a job. Will stream if optional callback is not provided.

####getJobStatus(jobId, [cb])

Requires a jobId. Will return the status of the job. Will stream if optional callback is not provided.

####getJobTasks(jobId, [cb])

Requires a jobId. Will return the tasks for the job. Will stream if optional callback is not provided.

####getTaskOutput(taskId, [cb])

Requires a taskId. Will return the task information. Will stream if optional callback is not provided.

### Channels
-------------

####listChannels([cb])

Takes an optional callback. Will list all channels - streaming if no cb.
