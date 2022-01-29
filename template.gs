/** DocTemplate
 */

// [START DocTemplate]
/**
 * @OnlyCurrentDoc Limits the script to only accessing the current presentation.
 */

/**
 * Create a open  menu item.
 * @param {Event} event The open event.
 */
function onOpen(event) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Open','showSidebar')
      .addItem('Help','showHelp')
      .addToUi();
  //TODO:  call updateVars() script
  //DocumentApp.getUi().Button.('#run-reload').click(updateVars);
}

/**
 * Open the Add-on upon install.
 * @param {Event} event The install event.
 */
function onInstall(event) {
  onOpen(event);
}

/**
 * Opens a sidebar in the document containing the add-on's user interface.
 */
function showSidebar() {
  var ui = HtmlService
      .createHtmlOutputFromFile('sidebar')
      .setTitle('Template');
  DocumentApp.getUi().showSidebar(ui);
}

/**
 * Opens a dialogbox with help.
 */
function showHelp() {
  var ui = DocumentApp.getUi();
  var result = ui.alert(
    'Provides a way to templatize documents using variables.',
    'Variables like ${XXX} are globally replaced.',
    ui.ButtonSet.OK);
}

function findAll(regex, sourceString, aggregator) {
  const arr = regex.exec(sourceString);
  if (arr === null) return aggregator;  
  const newString = sourceString.slice(arr.index + arr[0].length);
  return findAll(regex, newString, aggregator.concat([arr[1].slice(2, -1)]));
}

function removeDups(names) {
  var unique = {};
  names.forEach(function(i) {
    if(!unique[i]) {
      unique[i] = true;
    }
  });
  return Object.keys(unique);
}

function template(varList) {
  var document = DocumentApp.getActiveDocument().getBody();
  for (key in varList) {
    console.log(key  + ' => ' + varList[key][0] + ' > ' + varList[key][1]);
    if (varList[key][1] !== null) {
      document.replaceText("\\${name}", varList[key][1]);
    }
  }
}

function test() {
  var varList = collectVars();
  var retList = [[]];
  for (key in varList) {
    var test = key
    retList[key][0] = varList[key]
    retList[key][1] = "TEST_VAL" + key
  }
  template(retList)
}

function collectVars() {
  var document = DocumentApp.getActiveDocument();
  var text = document.getBody().getText()
  var re = /(\${[A-Za-z0-9]+})/;
  var templateVars = [];
  templateVars = templateVars.concat(findAll(re, text,templateVars));
  var unique = removeDups(templateVars);
  unique.sort();
  return unique;
}
// [END DocTemplate]
