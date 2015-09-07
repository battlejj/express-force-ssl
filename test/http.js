var chai = require('chai')
  , expect = chai.expect
  , request = require('request')
  , server
  , baseurl
  , secureBaseurl
  , SSLRequiredErrorText
  ;


before(function () {
  server = require('./server')({ httpPort: 8080, httpsPort: 8443 });
  baseurl = 'http://localhost:' + server.port;
  secureBaseurl = 'https://localhost:' + server.securePort;
  SSLRequiredErrorText = 'SSL Required.';
});

describe('Test standard HTTP behavior.', function(){

  it('Should not be redirected to SSL on non "SSL Only" endpoint.', function(done){
    request.get({
      url: baseurl,
      followRedirect: false,
      strictSSL: false
    }, function (error, response){
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      done();
    });
  });

  it('Should receive a 301 redirect on "SSL Only" endpoint.', function(done){
    var originalDestination = baseurl + '/ssl';
    var expectedDestination = secureBaseurl + '/ssl';
    request.get({
      url: originalDestination,
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body){
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(301);
      expect(response.headers.location).to.equal(expectedDestination);
      done();
    });
  });

  it('Should end up at secure endpoint on "SSL Only" endpoint.', function(done){
    var originalDestination = baseurl + '/ssl';
    var expectedDestination = secureBaseurl + '/ssl';
    request.get({
      url: originalDestination,
      followRedirect: true,
      strictSSL: false
    }, function (error, response, body){
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      expect(response.request.uri.href).to.equal(expectedDestination);
      done();
    });
  });

  /*
  I think these next two tests are completely redundant, but someone once opened an issue about this
  because they incorrectly configured their express server, so I had to write tests against his use case
  to prove this isn't actually a problem.
   */

  it('Should receive a 301 redirect on a deeply nested "SSL Only" endpoint.', function(done){
    var id = 12983498;
    var originalDestination = baseurl + '/ssl/nested/route/' + id;
    var expectedDestination = secureBaseurl + '/ssl/nested/route/' + id;
    request.get({
      url: originalDestination,
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body){
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(301);
      expect(response.headers.location).to.equal(expectedDestination);
      done();
    });
  });

  it('Should end up at secure endpoint on a deeply nested "SSL Only" endpoint.', function(done){
    var id = 233223625745;
    var originalDestination = baseurl + '/ssl/nested/route/' + id;
    var expectedDestination = secureBaseurl + '/ssl/nested/route/' + id;
    request.get({
      url: originalDestination,
      followRedirect: true,
      strictSSL: false
    }, function (error, response, body){
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      expect(response.request.uri.href).to.equal(expectedDestination);
      done();
    });
  });

  it('Should successfully POST data to non "SSL Only" endpoint.', function(done){
    var destination = baseurl + '/echo';
    var postData = { key1: 'Keyboard.', key2: 'Cat.'};
    request.post({
      url: destination,
      followRedirect: true,
      strictSSL: false,
      form: postData
    }, function(error, response, body){
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      expect(response.request.uri.href).to.equal(destination);
      expect(body).to.equal(JSON.stringify(postData));
      done();
    });
  });

  it('Should receive 403 error when POSTing data to "SSL Only" endpoint.', function(done){
    var destination = baseurl + '/sslEcho';
    var postData = { key1: 'Keyboard.', key2: 'Cat.'};
    request.post({
      url: destination,
      followRedirect: true,
      strictSSL: false,
      form: postData
    }, function(error, response, body){
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(403);
      expect(response.request.uri.href).to.equal(destination);
      expect(body).to.equal(SSLRequiredErrorText);
      done();
    });
  });
});