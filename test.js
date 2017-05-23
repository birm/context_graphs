var test = require('tape');
var graph = require("./graph.js");


function createDocument() {
  const document = jsdom(undefined);
  const window = document.defaultView;
  global.document = document;
  global.window = window;

  Object.keys(window).forEach((key) => {
    if (!(key in global)) {
      global[key] = window[key];
    }
  });

document = createDocument();


test( 'initialization tests', function(t) {
      t.plan(1);

      t.doesNotThrow( function() {
          basic = new graph("canvas",[4,5,2,1]);
      }, '*', "new graph() construction");
    });
