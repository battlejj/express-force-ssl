var bodyParser = require('body-parser')
  , express = require('express')
  , forceSSL = require('../../index')
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
    res.send('HTTPS Only. Port: ' + port + '. Got param of ' + req.param('id') + '.');
  });

  app.post('/echo', function (req, res) {
    res.json(req.body);
  });

  app.post('/sslEcho', forceSSL, function (req, res) {
    res.json(req.body);
  });

  app.set('httpsPort', 8443);

  secureServer.listen(8443);
  server.listen(8080);

  return {
    secureServer: secureServer,
    server: server,
    app: app
  };
})();

