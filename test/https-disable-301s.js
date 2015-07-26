var chai = require('chai')
  , expect = chai.expect
  , request = require('request')
  , server
  , baseurl
  , secureBaseurl
  , SSLRequiredErrorText
  ;

before(function () {
  server = require('./server')({ enable301Redirects: false, httpPort: 8090, httpsPort: 10443 });
  baseurl = 'http://localhost:' + server.port;
  secureBaseurl = 'https://localhost:' + server.securePort;
  SSLRequiredErrorText = 'SSL Required.';
});

describe('Test HTTPS behavior when 301 redirects are disabled.', function() {

  it('Should be able to get to SSL pages with no issue', function (done) {
    var sslEndpoint = secureBaseurl + '/ssl';

    request.get({
      url: sslEndpoint,
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body) {
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('HTTPS only.');
      done();
    });
  });

  it('Non ssl pages should continue to work normally', function (done) {
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

  it('Should receive a 403 error on "SSL Only" endpoint when accessed insecurely.', function (done) {
    var originalEndpoint = baseurl + '/ssl';

    request.get({
      url: originalEndpoint,
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body){
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(403);
      expect(body).to.equal(SSLRequiredErrorText);
      done();
    });
  });

  it('Should successfully POST data to non "SSL Only" endpoint.', function (done) {
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

  it('Should receive 403 error when POSTing data to "SSL Only" endpoint.', function (done) {
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