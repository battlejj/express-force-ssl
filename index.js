'use strict';

var defaultSSLPort = 443;
var defaultErrorResponse = 'SSL Required.';


function isSecure(req) {
  if (req.secure) {
    return true;
  }

  var forwardedProto = req.get('X-Forwarded-Proto');

  if (forwardedProto &&
      forwardedProto.toLowerCase &&
      forwardedProto.toLowerCase() === 'https') {
    return true;
  }

  return false;
}


module.exports = function getForceSSL(options) {
  options = options || {};

  var portPart = '';

  if (options.port &&
      options.port !== defaultSSLPort) {
    portPart = ':' + options.port;
  }

  var errorResponse = options.errorResponse || defaultErrorResponse;

  return function forceSSL(req, res, next) {
    if (isSecure(req)) {
      return next();
    }

    if (req.method !== 'GET') {
      res.status(403).send(errorResponse);
      return;
    }

    res.redirect(301, 'https://' + req.hostname + portPart + req.originalUrl);
  };
};
