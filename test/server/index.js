var bodyParser = require('body-parser')
  , express = require('express')
  , forceSSL = require('../../index')
  , fs = require('fs')
  , http = require('http')
  , https = require('https')
  ;

module.exports = function (options) {
  var ssl_options = {
    key: fs.readFileSync('./test/keys/localhost.key'),
    cert: fs.readFileSync('./test/keys/localhost.crt')
  };

  options = options || {};

  var httpPort = options.httpPort || 8080;
  var httpsPort = options.httpsPort || 8443;

  delete options.httpPort;

  var app = express();

  /*
   Allow for testing with POSTing of data
   */
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  var server = http.createServer(app);
  var secureServer = https.createServer(ssl_options, app);

  /*
   Routes
   */
  app.get('/', function (req, res) {
    res.send('HTTP and HTTPS.');
  });

  app.get('/ssl', forceSSL, function (req, res) {
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

  app.get('/override', function (req, res, next) {
    res.locals.forceSSLOptions = {
      enable301Redirects: false
    };
    next();
  }, forceSSL, function (req, res) {
    res.json(req.body);
  });

  //Old Usage
  //app.set('httpsPort', httpsPort);
  app.set('forceSSLOptions', options);
  secureServer.listen(httpsPort);
  server.listen(httpPort);

  return {
    secureServer: secureServer,
    server: server,
    app: app,
    securePort: httpsPort,
    port: httpPort,
    options: options
  };
};

