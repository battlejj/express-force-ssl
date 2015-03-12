var parseUrl = require('url').parse;
var _ = require('underscore');

var isSecure = function(req) {
  if (req.secure) {
    return true;
  } else if (
    req.get('X-Forwarded-Proto') &&
    req.get('X-Forwarded-Proto').toLowerCase &&
    req.get('X-Forwarded-Proto').toLowerCase() === 'https'
    ) {
    return true;
  }
  return false;
};

var defaults = {
  allowRedirects: true
};

exports = module.exports = function(options) {
  options = _.extend(defaults, options);

  return function(req, res, next){
    if(!isSecure(req)){
      if(req.method === "GET" && options.allowRedirects){
        var httpsPort = req.app.get('httpsPort') || 443;
        var fullUrl = parseUrl('http://' + req.header('Host') + req.url);
        res.redirect(301, 'https://' + fullUrl.hostname + ':' + httpsPort + req.url);
      } else {
        res.status(403).send('SSL Required.');
      }
    } else {
      next();
    }
  };
};
