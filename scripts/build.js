#!/usr/bin/env node

global.window = {};
global.document = {querySelectionAll: function () {}};
var td = require('../src/tripledollar'),
  	fs = require('fs'),
  	uglify = require('uglify-js');

var comment = "/* tripledollar v." + td.version + 
  ", (c) " + (1900 + (new Date).getYear()) + " Steen Klingberg. License MIT. */\n";

var code = fs.readFileSync('./src/tripledollar.js', 'utf8');

var options = {
  mangle: {
     toplevel: true,
  },
  nameCache: {}
}
fs.writeFileSync('./tripledollar.js', comment + uglify.minify(code, options).code);

