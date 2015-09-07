var chai = require('chai')
  , expect = chai.expect
  , request = require('request')
  , server
  , baseurl
  , secureBaseurl
  , SSLRequiredErrorText = 'Custom SSL Required Message.'
  ;

before(function () {
  server = require('./server')({
    enable301Redirects: false,
    httpPort: 8091,
    httpsPort: 11443,
    sslRequiredMessage: SSLRequiredErrorText
  });
  baseurl = 'http://localhost:' + server.port;
  secureBaseurl = 'https://localhost:' + server.securePort;
});

describe('Test HTTPS behavior when 301 redirects are disabled.', function () {
  it('301 Redirect should be disabled by user setting', function (done) {

    var endpoint = baseurl + '/ssl';

    request.get({
      url: endpoint,
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body) {
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(403);
      done()
    });

  });

  it('301 Redirect should be enabled by res.local setting', function (done) {

    var sslEndpoint = secureBaseurl + '/override';

    request.get({
      url: sslEndpoint,
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body) {
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });

  it('301 Redirect should be enabled by res.local setting', function (done) {

    var sslEndpoint = secureBaseurl + '/override';

    request.get({
      url: sslEndpoint,
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body) {
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      done();
    });

  });

  it('Custom error text test', function (done) {

    var endpoint = baseurl + '/ssl';

    request.get({
      url: endpoint,
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body) {
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(403);
      expect(body).to.equal(SSLRequiredErrorText);
      done();
    });

  });

});