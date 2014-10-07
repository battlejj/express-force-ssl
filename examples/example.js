var express = require('express')
  , forceSSL = require('./../index')
  , fs = require('fs')
  , http = require('http')
  , https = require('https')
  ;

var ssl_options = {
  key: fs.readFileSync('./test/keys/localhost.key'),
  cert: fs.readFileSync('./test/keys/localhost.crt'),
  ca: fs.readFileSync('./test/keys/localhost.crt')
};

var app = express();
var server = http.createServer(app);
var secureServer = https.createServer(ssl_options, app);

app.get('/', function(req, res){
  res.json({msg: 'accessible by http'});
});
app.get('/ssl', forceSSL, function(req, res){
  res.json({msg: 'only https'});
});

app.get('/ssl/deep/route/:id', forceSSL, function(req, res){
  var host = req.headers.host.split(':');
  var port = host.length > 1 ? host[1] : 'default port';
  res.json({msg: 'only https, port: ' + port, id: req.param('id')});
});

app.set('httpsPort', 8443);

secureServer.listen(8443);
server.listen(8080);