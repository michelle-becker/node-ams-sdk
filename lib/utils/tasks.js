
function template ( input, data ) {

  return input.replace(/\{%(\w*)%\}/g, function ( m, key ) { return data.hasOwnProperty(key) ? data[key] : "" } )

}

function buildThumbnailXML ( options ) {

  var task

  if ( !("Width" in options) || !("Height" in options) || !("Type" in options) || !("Value" in options) ) console.log('Please submit a Width, Height, Type, and Value for thumbnail generation.')

  task = "<?xml version=\"1.0\" encoding=\"utf-8\"?><Thumbnail Size=\"{%Width%},{%Height%}\" Type=\"{%Type%}\" Filename=\""

  if ( options.hasOwnProperty('OutputFileName') ) {

    task += options.OutputFileName

  } else {

    task +="{OriginalFilename}_{Size}_{ThumbnailTime}_{ThumbnailIndex}_{Date}_{Time}"

  }

  task += ".{DefaultExtension}\"><Time Value=\"{%Value%}\""

  if ( options.hasOwnProperty('Step') ) task += " Step=\"{%Step%}\""

  if ( options.hasOwnProperty('Stop') ) task += " Stop=\"{%Stop%}\""

  task += "/></Thumbnail>"

  return task

}

function buildIndexerXML ( options ) {


  if ( !("Title" in options) || !("Description" in options) ) console.log('Please specify a title and description for indexer')

  return  "<?xml version=\"1.0\" encoding=\"utf-8\"?><configuration version=\"2.0\"><input><metadata key=\"title\" value=\"{%Title%}\"/><metadata key=\"description\" value=\"{%Description%}\"/></input><settings></settings></configuration>"

}

function buildBasicXML ( options ) {

  //If this is a chained task, then we want to chain it.

  var input = 'JobInputAsset(0)'

  if ( options.chained && options.inc > 0 ) {

    input = 'JobOutputAsset(' + String(options.inc - 1) + ')'

  }

  return "<?xml version=\"1.0\" encoding=\"utf-8\"?><taskBody><inputAsset>" + input + "</inputAsset><outputAsset assetName=\"{%OutputAssetName%}\">JobOutputAsset({%inc%})</outputAsset></taskBody>"

}

exports.buildTaskXML = function ( options, inc ) {

  var task

  if ( options.Configuration === 'Thumbnails' ){

    task = buildThumbnailXML(options)

  } else if ( options.Configuration === 'Azure Media Indexer') {

    task = buildIndexerXML(options)

  } else {

    options.inc = inc || 0

    task = buildBasicXML(options)

  }

  return template(task, options)

}