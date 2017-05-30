var test = require('tape');
var graphs = require("./graph.js");
var graph = graphs.graph;
var loader = graphs.loader;
var {
  jsdom
} = require('jsdom');

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


test('initialization tests', function(t) {
  t.plan(2);
  data = {
    "luck": {
      "x": 10
    },
    "chance": {
      "x": 11
    },
    "spirit": {
      "x": 8
    }
  };
  t.doesNotThrow(function() {
    basic = new graph("canvas", data);
  }, '*', "new graph() construction");

  t.doesNotThrow(function() {
    basic = new loader(data);
  }, '*', "new loader() construction");
});
