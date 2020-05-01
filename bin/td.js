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
    open: Boolean,
    'prepare-dist': Boolean
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

function prepareDist () {
  let html = `
<!doctype html>
<html lang="en">
  <head>
    <title>Tripledollar</title>
    <meta charset="utf-8"></meta>
    <script src="bundle.js"></script>
  </head>
</html>
`;

  if (!fs.existsSync('dist/index.html')) {
    if (!fs.existsSync('dist')) {
      fs.mkdirSync('dist');
    }
    fs.writeFileSync('dist/index.html', html);
  }
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

function newIndexFile (name, cb) {
  var h = `<!doctype html>
<html lang="en">
  <head>
    <title>${name}</title>
    <meta charset="utf-8"></meta>
    <link rel="stylesheet" type="text/css" href="main.css"></link>
    <script src="http://steenk.github.io/tripledollar.js"></script>
    <script>
      $$$.appendToDoc(
        ['h1', {style: 'text-shadow: 2pt 2pt 4pt gray; color:gold;'}, 'Tripledollar'],
        ['p', 'Version ', $$$.version],
        ['h2', 'Just DOM scripting']
      );
    </script>
  </head>
</html>`;
  fs.writeFile('index.html', h, cb);
} 

function mainJSFile (name, cb) {
  var s = 'requirejs.config({\n' +
    " baseUrl: 'lib',\n" +
    " paths:  {\n" +
    "   app: '../app',\n" +
    "   lang: '../lang'\n" +
    " }\n" +
  "});\n\n" +
  "require(['tripledollar'], function ($$$) {\n" +
  " $$$.appendToDoc(\n" +
  "   ['h1', '" + name + "'],\n" +
  "   ['p', 'Just DOM scripting.']\n" +
  " )\n" +
  "})\n";
  fs.writeFile('main.js', s, cb);
}

function mainJSFileES6 (name, cb) {
  var s = `import $$$ from "tripledollar";
import './main.css';
import demo from './components/td-demo';

$$$.appendToDoc(['div.center',
  ['h1.tripledollar', 'Tripledollar'],
  ['p.version', 'Version ', $$$.version],
  demo()
])
.then(() => {
  demo.add('Build highly efficient web applications with just Javascript.');
});
`;
  fs.writeFile('main.js', s, cb);;
}

function lessFile (cb) {
  var s = '/* main.less */\n' +
  "body {\n" +
  " padding: 30px;\n" +
  "}\n";
  fs.writeFile('less/main.less', s, cb);
}

function cssFile (cb) {
  var s = `/* main.css */
body {
  padding: 30px;
  background-color: dimgray;
  color: gainsboro;
}
.center {
  margin-left: auto;
  margin-right: auto;
  width: 850px;
}
.tripledollar {
  text-shadow: 2pt 2pt 4pt white;
  color: gold;
  margin: auto;
}
.version {
  margin-top: 4px;
  margin-bottom: 26px;
  font-family: system-ui;
}`;
  fs.writeFile('main.css', s, cb);
}

function packageFile (cb) {
  let s = `{
  "name": "web-project",
  "version": "0.1.0",
  "description": "",
  "main": "dist/bundle.js",
  "scripts": {
    "build": "rollup -c", 
    "start": "td -s -o"
  },
  "author": "",
  "license": "MIT",
  "devDependencies": {
    "rollup": ">=2.0.6",
    "@rollup/plugin-node-resolve": "^7.1.1",
    "rollup-plugin-postcss": ">=2.5.0",
    "less": "^3.11.1",
    "tripledollar": ">=1.6.3"
  }
  "dependencies": {
    "body-parser": "^1.19.0",
    "connect": "^3.7.0",
    "connect-query": "^1.0.0",
    "morgan": "^1.10.0",
    "serve-static": "^1.14.1",
    "url": "^0.11.0"
  }
}`;
  fs.writeFile('package.json', s, cb);
}

function rollupConfig (cb) {
  let s = `import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
 
export default {
  input: 'main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    resolve(),
    postcss({
      plugins: [
      ]
    })
  ]
}`;
  fs.writeFile('rollup.config.js', s, cb);
}

function serverFile (cb) {
  let s = `const connect = require('connect')
,   http = require('http')
,   bodyParser = require('body-parser')
,   stat = require('serve-static')
,   queries = require('connect-query')
,   morgan = require('morgan');

const PORT = '3000';

function serve (port) {
  port = port || '3000';

  let app = connect()
  .use(morgan(':date :method :url :status'))
  .use(queries())
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())

  .use('/exit', function (req, res, next) {
    res.end();
    process.exit();
  })
  
  .use('/status', function (req, res, next) {
    res.write('Running on port ' + port + ' with root ' + __dirname + '/dist' + '\\n');
    res.end();
  })

  // Serving static content from the dist folder
  .use(stat(__dirname +'/dist'));

  http.createServer(app).listen(port, "127.0.0.1");

  console.log('\\nStarted', __filename.substring(__dirname.length + 1), 'in', process.cwd(), 'on port', port, '.\\n');

}
serve(PORT);`;
  fs.writeFile('server.js', s, cb);
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
  console.log();
  fs.readdir('.', function (err, files) {
    ['index.html', 'main.js', 'main.css', 'rollup.config.js', 'package.json']
    .forEach(function (fname) {
      if (files.indexOf(fname) > -1) occupied = true;
    });
    if (occupied) {
      console.log('A file or directory exists already.')
    } else {
      fs.mkdir('components/td-demo', {recursive: true}, function (err) {
        copyFile(__dirname + '/../components/td-demo/index.js', 'components/td-demo/index.js');
        copyFile(__dirname + '/../components/td-demo/style.less', 'components/td-demo/style.less');

        serverFile(function (err) {
          cssFile(function (err) {
            mainJSFileES6(name, function (err) {
              packageFile(function (err) {
                  rollupConfig(function (err) {
                  console.log('Basic structure is created for DOM scripting.');
                  console.log('Install dependencies and build with rollup:\n');
                  console.log('\tnpm install');
                  console.log('\tnpm run build');
                  console.log('\tnpm run start\n');
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
  let io = {darwin: 'inherit', linux: 'inherit', win32: 'ignore', win64: 'ignore', 'undefined': 'ignore'}[process.platform];
  if (fs.existsSync(process.cwd() + '/server.js') && fs.existsSync(process.cwd() + '/dist/index.html')) {
    if (!fs.existsSync(process.cwd() + '/dist/bundle.js')) {
      console.log();
      console.log('Run "npm run build" first, to generate "bundle.js".');
      console.log();
      process.exit();
    }
    let proc = child_process.spawn(process.execPath, [process.cwd() + '/server.js', 'dist'], {
        cwd: process.cwd(),
        detached: true,
        stdio: io,
        env: env
    });
    if (proc.pid) {
       if (opt.open) {
            setTimeout(openBrowser, 300, prop.path);
      }
      proc.unref();
    }
  } else {
    let child = tdserv.start({
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
    }
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
  prepareDist();
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
      console.log('  -' + item + '  ' + shorts[item] + '  ' + descr[item]);
    }
  }
}
