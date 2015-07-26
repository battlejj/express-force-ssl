var chai = require('chai')
  , expect = chai.expect
  , request = require('request')
  , server
  , secureBaseurl
  , SSLRequiredErrorText
  ;

before(function () {
  server = require('./server')({ httpPort: 8086, httpsPort: 6443 });
  secureBaseurl = 'https://localhost:' + server.securePort;
  SSLRequiredErrorText = 'SSL Required.';
});

describe('Test standard HTTPS behavior.', function() {

  it('Should have no redirection from SSL on non "SSL Only" endpoint.', function (done) {
    request.get({
      url: secureBaseurl,
      followRedirect: false,
      strictSSL: false
    }, function (error, response, body) {
      //noinspection BadExpressionStatementJS
      expect(error).to.not.exist;
      expect(response.statusCode).to.equal(200);
      expect(body).to.equal('HTTP and HTTPS.');
      done();
    });
  });

  it('Should have no redirection from SSL on "SSL Only" endpoint.', function (done) {
    request.get({
      url: secureBaseurl + '/ssl',
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

  it('Should successfully POST to an "SSL Only" endpoint.', function(done){
    var destination = secureBaseurl + '/sslEcho';
    var postData = { key1: 'Keyboard.', key2: 'Cat.'};
    request.post({
      url: destination,
      followRedirect: false,
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

});