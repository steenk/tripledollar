#!/usr/bin/env node

var nopt = require('nopt'),
	fs = require('fs'),
	npm = require('npm'),
	path = require('path'),
	known = {
		init: Boolean,
		name: String,
		get: String,
		version: Boolean
	},
	shorts = {
		i: '--init',
		n: '--name',
		g: '--get',
		v: '--version',
		h: '--help'
	},
	descr = {
		i: 'create initial structure',
		n: 'optional name of the project',
		g: 'get any client library from npm',
		v: 'version of tripledollar',
		h: 'this help text'
	};


var opt = nopt(known, shorts);

function html (elem, attr, cont) {
    if (typeof attr === 'string') {
        cont = attr;
        attr = {};
    }
    attr = attr || {};
    cont = cont || '';
    var att = '';
    for (var key in attr) {
        att += ' ' + key + '="' + attr[key] + '"';
    }
    return '<' + elem + att + '>' + cont + '</' + elem + '>';
}

function indexFile (name, cb) {
	var h = '<!doctype html>';
	h += html('html', {lang: 'en'}, '\n\t' +
			html('head', '\n\t\t' +
				html('title', name) + '\n\t\t' +
				html('meta', {charset: 'utf-8'}) + '\n\t\t' +
				html('link', {rel: 'stylesheet/less', type: 'text/css', href: 'less/main.less'}) + '\n\t\t' +
				html('script', {src: 'lib/less.js'}) +'\n\t\t' +
				html('script', {src: 'lib/require.js', 'data-main': 'main.js'}) + '\n\t') + 
			'\n');
	fs.writeFile('index.html', h, cb);
}

function mainJSFile (name, cb) {
	var s = 'requirejs.config({\n' +
    "	baseUrl: 'lib',\n" +
    "	paths:  {\n" +
    "		app: '../app',\n" +
    "		lang: '../lang'\n" +
    "	}\n" +
	"});\n\n" +
	"require(['tripledollar'], function ($$$) {\n" +
	"	$$$.appendToDoc (\n" +
	"		['h1', '" + name + "'],\n" +
	"		['p', 'Just DOM scripting.']\n" +
	"	)\n" +
	"})\n";
	fs.writeFile('main.js', s, cb);
}

function lessFile (cb) {
	var s = '/* main.less */\n' +
	"body {\n" +
	"	padding: 30px;\n" +
	"}\n";
	fs.writeFile('less/main.less', s, cb);
}

function copyFile (from, to) {
	fs.readFile(from, function (err, data) {
	    fs.writeFile(to, data, function (err) {
	      	if (err) {
	       		console.log("Can't create", to);
	       	}
	   });
	})
}

function init (name) {
	var occupied, td, req, dl;
	var mdir = __dirname + '/../node_modules/';
	fs.readdir('.', function (err, files) {
		['index.html', 'lib', 'less', 'app']
		.forEach(function (fname) {
			if (files.indexOf(fname) > -1) occupied = true;
		});
		if (occupied) {
			console.log('A file or directory exists already.')
		} else {
			fs.mkdir('lib', function () {
				fs.mkdir('less', function () {
					copyFile(__dirname + '/../tripledollar.js', 'lib/tripledollar.js')
					copyFile(mdir + 'less/dist/less.min.js', 'lib/less.js')
					copyFile(mdir + 'requirejs/require.js', 'lib/require.js')
					indexFile(name, function (err) {
						lessFile(function (err) {
						 	mainJSFile(name, function (err) {
						         console.log('Basic structure is created for DOM scripting.');
						    })
				        })
					})
				})
			})
		}
	})
}

function install (name) {
	var pack;
	npm.load(null, function (err) {
        dir = npm.dir + '/';
        fs.exists(dir + name, function (exists) {
            if (exists) {
            	pack = require(dir + name + '/package.json');
            	var fname = path.basename(name, '.js') + '.js';
            	copyFile(dir + name + '/' + pack.main, './' + fname);
            } else {
            	npm.install(name, function (err, res) {
            		if (!err) {

            		}
            	})
            }
        })
    })
}

function getLib (names) {
	names.forEach(function (name) {
		install(name);
	})
}

function getVersion () {
	var pack = require(__dirname + '/../package.json');
	console.log(pack.version);
}

if (opt.init) {
	var name = opt.name || 'Tripledollar';
	init(name);
} else if (opt.get) {
	getLib(opt.argv.remain.concat(opt.get));
} else if (opt.version) {
	getVersion();
} else {
	console.log("Tripledollar - a JavaScript library for DOM scripting.")
	console.log('Usage: td [options]');
	console.log('Options:');
	for(var item in shorts) {
		console.log('  -' + item + '  ' + shorts[item] + '	' + descr[item]);
	}
}
