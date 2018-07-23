import ext from "./utils/ext";
import PARSE_TYPES from './PARSE_TYPES';

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

var getUrl = (code, type) => {
  if (type === PARSE_TYPES.REPORT) {
    return `https://wowanalyzer.com/report/${code}`;
  } else if (type === PARSE_TYPES.CHARACTER) {
    return `https://wowanalyzer.com/character/${code.region.toUpperCase()}/${toTitleCase(code.realm)}/${toTitleCase(code.name)}/`;
  }
}

var getMessage = (code, type) => {
  if (type === PARSE_TYPES.REPORT) {
    return `
      Report code is: <code>${code}</code>.
      <br/>
      You can navigate to WoWAnalyzer by pressing the Analyze button.
    `;
  } else if (type === PARSE_TYPES.CHARACTER) {
    return `
      Character is: <code>${toTitleCase(decodeURIComponent(code.realm))} - ${toTitleCase(decodeURIComponent(code.name))}</code>.
      <br/>
      You can navigate to WoWAnalyzer by pressing the Analyze button.
    `;
  } else {
    return `
      ${type}
    `;
  }
}

var template = (data) => {
  return (`
  <div class="site-description">
    <h3 class="title">This ${data.type === PARSE_TYPES.REPORT ? 'log' : 'character'} can be analyzed!</h3>
    <p className="description">
      ${getMessage(data.code, data.type)}
    </p>
  </div>
  <div class="action-container">
    <a href=${getUrl(data.code, data.type)} target="_blank" class="btn btn-primary">Analyze</a>
  </div>
  `);
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var renderBookmark = (data) => {
  var displayContainer = document.getElementById("display-container")
  if(data) {
    var tmpl = template(data);
    displayContainer.innerHTML = tmpl;  
  } else {
    renderMessage("Sorry, could not extract the report code.")
  }
}

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
});
