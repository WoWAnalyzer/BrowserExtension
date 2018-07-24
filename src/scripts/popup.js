import ext from "./utils/ext";
import PARSE_TYPES from './PARSE_TYPES';

var getUrl = (code, type) => {
  console.log("renderBookmark");
  if (type === PARSE_TYPES.REPORT) {
    return `https://wowanalyzer.com/report/${code}`;
  } else if (type === PARSE_TYPES.CHARACTER) {
    return `https://wowanalyzer.com/character/${code.region.toUpperCase()}/${code.realm}/${code.name}/`;
  }
}

var getDisplayCode = (code, type) => {
  if (type === PARSE_TYPES.REPORT) {
    return `
      <code>${code}</code>
    `;
  } else if (type === PARSE_TYPES.CHARACTER) {
    return `
      <code>${decodeURIComponent(code.name)}<br/>${code.region.toUpperCase()} - ${decodeURIComponent(code.realm)}</code>
    `;
  }
}

var template = (code, type) => {
  return (`
  <div class="site-description">
    <h3 class="title">This ${type === PARSE_TYPES.REPORT ? 'log' : 'character'} can be analyzed!</h3>
    <p className="description">
      ${getDisplayCode(code, type)}
      <span class="tip">
        You can navigate to WoWAnalyzer by pressing the Analyze button.
      </span>
    </p>
  </div>
  <div class="action-container">
    <a href=${getUrl(code, type)} target="_blank" class="btn btn-primary">Analyze</a>
  </div>
  `);
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var renderBookmark = (data) => {
  var displayContainer = document.getElementById("display-container")
  if(data.type !== PARSE_TYPES.NONE) {
    var tmpl = template(data.code, data.type);
    displayContainer.innerHTML = tmpl;  
  } else {
    renderMessage("Sorry, couldn't find a report code or character name.")
  }
}

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
});
