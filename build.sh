#!/usr/bin/env node

global.window = {};
global.document = {querySelectionAll: function () {}};
var td = require('./src/tripledollar.complete')
 ,  fs = require('fs')
 ,  uglify = require('uglify-js');

var comment = "/* tripledollar v." + td.version + 
  ", (c) " + (1900 + (new Date).getYear()) + " Steen Klingberg. License MIT. */\n";

var code = fs.readFileSync('./src/tripledollar.complete.js', 'utf8');
var ast = uglify.parse(code);
ast.figure_out_scope();
ast.compute_char_frequency();
ast.mangle_names();
fs.writeFileSync('./tripledollar.js', comment + ast.print_to_string());

// doc
(function () {
	var file = './src/tripledollar.complete.js',
		outfile = './docs/index.md';

	fs.readFile(file, function (err, f) {
	    var s = f.toString();
	    eval(s, this);
	});

	var window = {

		define: function (m, t) {
		    var f, s = '';
		    s += file + '\n';
		    s += '==========\n';
		    if (t && typeof t === 'function') {
		        f = t();
		    } else if (typeof m === 'function') {
		        f = m();
		    }
		    if (Array.isArray(m)) {
		        s += 'Modules: ', m.join(', ') + '\n';
		        s += '------------' + '\n';
		    }
		    var z;
		    for (z in f) {
		        s += z + ' **' + typeof f[z] + '**  \n';
		    }
		    fs.writeFile(outfile, s);
		}
	}
}());
