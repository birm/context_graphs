var test = require('tape');
var graph = require("./graph.js");
var { jsdom } = require('jsdom');

function createDocument() {
  const document = jsdom("<div id='canvas'></div>");
  const window = document.defaultView;
  global.document = document;
  global.window = window;

  Object.keys(window).forEach((key) => {
    if (!(key in global)) {
      global[key] = window[key];
    }
  });

  return document;
}

document = createDocument();


test( 'initialization tests', function(t) {
    t.plan(1);

    t.doesNotThrow( function() {
        basic = new graph("canvas",[4,5,2,1]);
    }, '*', "new graph() construction");
  });
