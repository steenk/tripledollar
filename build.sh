#!/usr/bin/env node

global.window = {};
global.document = {querySelectionAll: function () {}};
var td = require('./src/tripledollar.complete')
 ,  fs = require('fs')
 ,  uglify = require('uglify-js');

var comment = "/* tripledollar v." + window.$$$.version + 
  ", (c) " + (1900 + (new Date).getYear()) + " Steen Klingberg. License MIT. */\n";

var code = fs.readFileSync('./src/tripledollar.complete.js', 'utf8');
var ast = uglify.parse(code);
ast.figure_out_scope();
ast.compute_char_frequency();
ast.mangle_names();
fs.writeFileSync('./tripledollar.js', comment + ast.print_to_string());
