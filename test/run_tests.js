var	child_process = require('child_process'),
    browse = {darwin: 'open', linux: 'xdg-open'},
    http = require('http'),
    tdserv = require('td-server');;

function server (prop) {
    var env = process.env;
    env.TD_PORT = 3000;
    var io = {darwin: 'inherit', linux: 'inherit', win32: 'ignore', win64: 'ignore', 'undefined': 'ignore'}[process.platform],
    child = tdserv.start({
      cwd: prop.cwd,
      detached: true,
      stdio: io,
      env: env
    });
    if (child.process.pid) {
      setTimeout(openBrowser, 300, 'test/tests.html');
      child.process.unref();
    }
}

function killServer (cb) {
  var opts = {
    hostname: '127.0.0.1',
    port: 3000,
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

function openBrowser (pathname) {
  var pathname = pathname || '/',
      browse = {darwin: 'open', linux: 'xdg-open', win32: 'start', win64: 'start'};
  if (pathname && !pathname.startsWith('/')) {
    pathname = '/' + pathname;
  }
  child_process.exec(browse[process.platform] + ' http://127.0.0.1:3000' + pathname, function(err){
        if(err) {
      console.log('Error', err);
    }
  });
  setTimeout(killServer, 2000, () => {});
}

killServer(function () {
    server({cwd: process.cwd()});
});

//child_process.exec(browse[process.platform] + ' ' + __dirname + '/tests.html');
