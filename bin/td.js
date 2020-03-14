#!/usr/bin/env node

var nopt = require('nopt'),
	fs = require('fs'),
	//npm = require('npm'),
	path = require('path'),
	http = require('http')
	tdserv = require('td-server'),
	child_process = require('child_process'),
	known = {
		init: Boolean,
		name: String,
		//get: String,
		version: Boolean,
		status: Boolean,
		start: Boolean,
		public: Boolean,
		port: Number,
		kill: Boolean,
		open: Boolean
	},
	shorts = {
		i: '--init',
		n: '--name',
		//g: '--get',
		v: '--version',
		o: '--open',
		s: '--start',
    q: '--public',
		p: '--port',
		k: '--kill',
		r: '--status',
		h: '--help'
	},
	descr = {
		i: 'create initial structure',
		n: 'optional name of the project',
		//g: 'get any client library from npm',
		o: 'open browser [optionally provide a subpath]',
		s: 'start the server',
    q: 'use public ip addresses, not just the default 127.0.0.1',
		p: 'port for server, default is 3000',
		k: 'kill the server on the given port',
		v: 'version of tripledollar',
		r: 'check if server is running',
		h: 'this help text'
	},
	port = process.env.TD_PORT || 3000;


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
	var h = '<!doctype html>\n';
	h += html('html', {lang: 'en'}, '\n\t' +
			html('head', '\n\t\t' +
				html('title', name) + '\n\t\t' +
				html('meta', {charset: 'utf-8'}) + '\n\t\t' +
				html('link', {rel: 'stylesheet/less', type: 'text/css', href: 'less/main.less'}) + '\n\t\t' +
				html('script', {src: 'lib/less.js'}) +'\n\t\t' +
				html('script', {src: 'main.js', type: 'module'}) + '\n\t') + 
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
	"	$$$.appendToDoc(\n" +
	"		['h1', '" + name + "'],\n" +
	"		['p', 'Just DOM scripting.']\n" +
	"	)\n" +
	"})\n";
	fs.writeFile('main.js', s, cb);
}

function mainJSFileES6 (name, cb) {
	var s = 'import $$$ from  "./lib/tripledollar.mjs";\n' +
  '/* Use this instead when building with rollup or webpack:\n' +
  'import $$$ from "tripledollar";\n' +
  '*/\n\n' +
	"$$$.appendToDoc(\n" +
	"	['h1', {style: 'text-shadow: 2pt 2pt 4pt gray; color:gold;'}, 'Tripledollar'],\n" +
	"	['p', 'Version ', $$$.version],\n" +
	"	['h2', 'Just DOM scripting']\n" +
	");\n";
	fs.writeFile('main.js', s, cb);;
}

function lessFile (cb) {
	var s = '/* main.less */\n' +
	"body {\n" +
	"	padding: 30px;\n" +
	"}\n";
	fs.writeFile('less/main.less', s, cb);
}

function packageFile (cb) {
  let s = `{
  "name": "web-project",
  "version": "0.1.0",
  "description": "",
  "main": "main.js",
  "directories": {
    "lib": "lib"
  },
  "scripts": {
    "build": "rollup main.js --file dist/bundle.js --format iife -p @rollup/plugin-node-resolve ; lessc less/main.less dist/style.css ; node lib/build.js ; td -s -o dist"
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "@rollup/plugin-node-resolve": "^7.1.1",
    "less": ">=3.11.1",
    "rollup": ">=2.0.6",
    "tripledollar": ">=1.6.3"
  }
}`;
  fs.writeFile('package.json', s, cb);
}

function copyFile (from, to) {
	fs.readFile(from, function (err, data) {
		if (!err) {
	    	fs.writeFile(to, data, function (err) {
	      		if (err) {
	       			console.log("Can't create", to, '.');
	       		} else {
	       			console.log('Copied', path.normalize(to), 'to current directory.');
	       		}
	   		});
		}
	})
}

function init (name) {
	var occupied, td, req, dl;
	var mdir = __dirname + '/../node_modules/';
	fs.readdir('.', function (err, files) {
		['index.html', 'lib', 'less', 'app', 'package.json']
		.forEach(function (fname) {
			if (files.indexOf(fname) > -1) occupied = true;
		});
		if (occupied) {
			console.log('A file or directory exists already.')
		} else {
			fs.mkdir('lib', function () {
				fs.mkdir('less', function () {
					copyFile(__dirname + '/../tripledollar.mjs', 'lib/tripledollar.mjs')
					copyFile(mdir + 'less/dist/less.min.js', 'lib/less.js')
          copyFile(__dirname + '/../lib/build.js', 'lib/build.js')
					indexFile(name, function (err) {
						lessFile(function (err) {
						 	mainJSFileES6(name, function (err) {
                packageFile(function (err) {
						       console.log('Basic structure is created for DOM scripting.');
                   console.log('Run "td --start --open" to start a web server.\n');
                   console.log('Build with rollup is done after "npm i" with "npm run build".\n');
                })
						  })
				    })
					})
				})
			})
		}
	})
}

function checkAndCopy (name, dir) {
	var pack = require(dir + name + '/package.json'),
		fname = path.basename(name, '.js') + '.js';
	fs.exists(dir + name + '/dist/' + fname, function (exists) {
		if (exists) {
			copyFile(dir + name + '/dist/' + fname, './' + fname);
		} else {
			copyFile(dir + name + '/' + pack.main, './' + fname);
    	}
	});
}

/*
function install (name) {
	var pack;
	npm.load(null, function (err) {
        dir = npm.dir + '/';
        fs.exists(dir + name, function (exists) {
            if (exists) {
				checkAndCopy(name, dir);
            } else {
            	npm.install(name, function (err, res) {
            		if (!err) {
						checkAndCopy(name, dir);
            		}
            	})
            }
        })
    })
}
*/

function getLib (names) {
	names.forEach(function (name) {
		install(name);
	})
}

function getVersion () {
	var pack = require(__dirname + '/../package.json');
	console.log(pack.version);
}

function server (prop) {
	var env = process.env;
	env.TD_PORT = port;
	var io = {darwin: 'inherit', linux: 'inherit', win32: 'ignore', win64: 'ignore', 'undefined': 'ignore'}[process.platform],
		child = tdserv.start({
			cwd: prop.cwd,
			detached: true,
			stdio: io,
			argv0: prop.public ? '0.0.0.0' : '',
			env: env
  	});
    if (child.process.pid) {
	   if (opt.open) {
        	setTimeout(openBrowser, 300, prop.path);
		}
		console.log();
		console.log('HTTP server started with PID', child.process.pid, 'and port', child.port, 'and root', child.root);
		console.log('Use command "td --kill" to stop it.');
		console.log();
		child.process.unref();
	}
}

function killServer (cb) {
	var opts = {
		hostname: '127.0.0.1',
		port: port,
		path: '/exit',
		method: 'GET'
	}
	var req = http.request(opts, function () {
		cb();
	})
	req.on('error', function () {
		cb();
	});
	req.end();
}

function getStatus () {
    var opts = {
        hostname: '127.0.0.1',
        port: port,
        path: '/status',
        method: 'GET'
    }
    var req = http.request(opts, function (res) {
		res.setEncoding('utf8');
		res.on('data', function (data) {
		   console.log('td:', data);
		});
	});
	req.on('error', function () {
		console.log('No server started.');
	});
	req.end();
}

function openBrowser (pathname) {
  var pathname = pathname || '/',
	    browse = {darwin: 'open', linux: 'xdg-open', win32: 'start', win64: 'start'};
  if (pathname && !pathname.startsWith('/')) {
    pathname = '/' + pathname;
  }
	child_process.exec(browse[process.platform] + ' http://127.0.0.1:' + port + pathname, function(err){
        if(err) {
			console.log('Error', err);
		}
	});
}

if (opt.port) {
	port = parseInt(opt.port);
}
if (opt.init) {
	var name = opt.name || 'Tripledollar';
	init(name);
} else if (opt.get) {
	getLib(opt.argv.remain.concat(opt.get));
} else if (opt.version) {
	getVersion();
} else if (opt.start) {
	killServer(function () {
		server({cwd: process.cwd(), path: opt.argv.remain[0], public: opt.public});
	});
} else if (opt.open) {
  openBrowser(opt.argv.remain[0]);
} else if (opt.kill) {
	killServer(function () {
		console.log('Server is killed.');
	});
} else if (opt.status) {
	getStatus();
} else {
	console.log("Tripledollar - a JavaScript library for DOM scripting.")
	console.log('Usage: td [options]');
	console.log('Options:');
	for(var item in shorts) {
		if (item.indexOf('___') !== 0) {
			console.log('  -' + item + '  ' + shorts[item] + '	' + descr[item]);
		}
	}
}
