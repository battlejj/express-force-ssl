var chai = require('chai')
  , expect = chai.expect
  , express = require('express')
  , forceSSL = require('../index')
  , fs = require('fs')
  , http = require('http')
  , https = require('https')
  , request = require('request')
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
  res.json({msg: 'on http'});
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

describe('Test SSL Redirect', function(){
  it('Should not automatically redirect to SSL for a non Force SSL middleware page.', function(done){
    request.get({
      url: 'http://localhost:8080',
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body) {
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Should redirect to SSL for a Force SSL middleware page.', function(done){
    request.get({
      url: 'http://localhost:8080/ssl',
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body) {
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(301);
      done();
    });
  });

  it('Should redirect to SSL on correct port for a Force SSL middleware page.', function(done){
    request.get({
      url: 'http://localhost:8080/ssl',
      followRedirect: true,
      strictSSL: false
    }, function (error, response, body) {
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      expect(response.request.uri.port).to.equal(app.get('httpsPort').toString());
      done();
    });
  });

  it('Should redirect to SSL on correct port for a nested URL with Force SSL middleware.', function(done){
    request.get({
      url: 'http://localhost:8080/ssl/deep/route/50',
      followRedirect: true,
      strictSSL: false
    }, function (error, response, body) {
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      expect(response.request.uri.port).to.equal(app.get('httpsPort').toString());
      body = JSON.parse(body);
      expect(body).to.have.property('msg');
      expect(body.msg).to.equal('only https, port: ' + app.get('httpsPort').toString());
      expect(body).to.have.property('id');
      expect(body.id).to.equal('50');
      done();
    });
  });

  it('Should not redirect to SSL if X-Forwarded-Proto header exists and equals https.', function(done){
    request.get({
      url: 'http://localhost:8080/ssl',
      followRedirect: false,
      strictSSL: false,
      headers: {
        'X-Forwarded-Proto': 'https'
      }
    }, function (error, response, body) {
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Should not redirect to SSL if X-Forwarded-Proto header exists and equals HTTPS.', function(done){
    request.get({
      url: 'http://localhost:8080/ssl',
      followRedirect: false,
      strictSSL: false,
      headers: {
        'X-Forwarded-Proto': 'https'
      }
    }, function (error, response, body) {
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Should redirect to SSL if X-Forwarded-Proto header exists and is not an insensitive value of HTTPS.', function(done){
    request.get({
      url: 'http://localhost:8080/ssl',
      followRedirect: false,
      strictSSL: false,
      headers: {
        'X-Forwarded-Proto': 'something-else'
      }
    }, function (error, response, body) {
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(301);
      done();
    });
  });
});

