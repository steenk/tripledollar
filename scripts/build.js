#!/usr/bin/env node

global.window = {};
global.document = {querySelectionAll: function () {}};
var td = require('../src/tripledollar'),
  	fs = require('fs'),
  	uglify = require('uglify-js-es6');

var comment = "/* tripledollar v." + td.version + 
  ", (c) " + (1900 + (new Date).getYear()) + " Steen Klingberg. License MIT. */\n";

// AMD module
var options = {}

fs.writeFileSync('./tripledollar.js', comment + uglify.minify('./src/tripledollar.js', options).code);

// ES6 module
fs.writeFileSync('./tripledollar.mjs', comment + uglify.minify('./src/tripledollar.mjs', options).code);
