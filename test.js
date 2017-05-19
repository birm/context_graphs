var test = require('tape');
var graph = require("./graph.js");


test( 'initialization tests', function(t) {
      t.plan(1);

      t.doesNotThrow( function() {
          basic = new graph("canvas",[4,5,2,1]);
      }, '*', "new MiniMat() construction");
    });
