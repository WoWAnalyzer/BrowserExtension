import ext from "./utils/ext";
import PARSE_TYPES from './PARSE_TYPES';

var extractTags = () => {
  var url = document.location.href;

  var reportRegex = /warcraftlogs\.com\/reports\/([a-zA-z1-9]+)/;
  var characterIdRegex = /warcraftlogs\.com\/character\/id\/([1-9]+)/;
  var characterNameRegex = /warcraftlogs\.com\/character\/([A-Za-z]{2})\/(\S*)\/(\S*)/;

  if(!url) {
    return
  };

  var code = null;
  var type = 0;

  url = url.replace(/\/$/, '');

  if (reportRegex.test(url)) {
    // use report code
    code = url.match(reportRegex)[1];
    type = PARSE_TYPES.REPORT;
  } else if (characterIdRegex.test(url) || characterNameRegex.test(url)) {
    //use character from DOM
    var name = document.getElementById("character-name").innerText;
    var serverString = document.getElementById("server-link").innerText;
    var region = serverString.split('-')[0];
    var realm = serverString.split('-').slice(1).join('-');

    type = PARSE_TYPES.CHARACTER;
    code = {
      region: region,
      realm: realm,
      name: name
    };
  }

  if (!code || type === 0) {
    return
  };

  var data = {
    url: document.location.href,
    type: type,
    code: code
  }

  return data;
}

function onRequest(request, sender, sendResponse) {
  if (request.action === 'process-page') {
    sendResponse(extractTags())
  }
}

ext.runtime.onMessage.addListener(onRequest);