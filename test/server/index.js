var httpsPort = 8443;
var defaultSSLPort =  443;
var customReponse = 'Oh noes, y u got no SSL?';

var bodyParser = require('body-parser')
  , express = require('express')
  , getForceSSL = require('../../index')
  , forceSSL = getForceSSL({ port: httpsPort })
  , forceSSLDefaultPort = getForceSSL({ port: defaultSSLPort })
  , forceSSLCustomResponse = getForceSSL({ errorResponse: customReponse })
  , fs = require('fs')
  , http = require('http')
  , https = require('https')
  ;
module.exports = (function() {
  var ssl_options = {
    key: fs.readFileSync('./test/keys/localhost.key'),
    cert: fs.readFileSync('./test/keys/localhost.crt')
  };

  var app = express();

  /*
   Allow for testing with POSTing of data
   */
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  var server = http.createServer(app);
  var secureServer = https.createServer(ssl_options, app);
  var secureServerWithDefaultPort = https.createServer(ssl_options, app);

  /*
   Routes
   */
  app.get('/', function (req, res) {
    res.send('HTTP and HTTPS.');
  });

  app.get('/ssl', forceSSL, function (req, res) {
    res.send('HTTPS only.');
  });

  app.get('/sslDefaultPort', forceSSLDefaultPort, function (req, res) {
    res.send('HTTPS only.');
  });

  app.get('/ssl/nested/route/:id', forceSSL, function (req, res) {
    var host = req.headers.host.split(':');
    var port = host.length > 1 ? host[1] : 'default port';
    res.send('HTTPS Only. Port: ' + port + '. Got param of ' + req.params.id + '.');
  });

  app.post('/echo', function (req, res) {
    res.json(req.body);
  });

  app.post('/sslEcho', forceSSL, function (req, res) {
    res.json(req.body);
  });

  app.post('/customReponse', forceSSLCustomResponse, function (req, res) {
    res.send('HTTPS only.');
  });

  server.listen(8080);
  secureServer.listen(httpsPort);
  secureServerWithDefaultPort.listen(defaultSSLPort);

  return {
    app: app,
    server: server,
    secureServer: secureServer,
    secureServerWithDefaultPort: secureServerWithDefaultPort,
  };
})();

