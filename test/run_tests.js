var	child_process = require('child_process')
,	browse = {darwin: 'open', linux: 'xdg-open'};

child_process.exec(browse[process.platform] + ' ' + __dirname + '/tests.html');
