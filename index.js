var parseUrl = require('url').parse;
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
exports = module.exports = function(req, res, next){
  if(!isSecure(req)){
    if(req.method === "GET"){
      var httpsPort = req.app.get('httpsPort') || 443;
      var fullUrl = parseUrl(req.protocol + '://' + req.header('Host') + req.originalUrl);
      res.redirect(301, 'https://' + fullUrl.hostname + ':' + httpsPort + req.url);
    } else {
      res.status(403).send('SSL Required.');
    }
  } else {
    next();
  }
};
