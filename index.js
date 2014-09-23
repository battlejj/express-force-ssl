var parseUrl = require('url').parse;
var isSecure = function(req) {
  if (req.secure) {
    return true;
  } else if (
    typeof req.get('X-Forwarded-Proto') !== 'undefined' &&
    typeof req.get('X-Forwarded-Proto').toLowerCase !== 'undefined' &&
    req.get('X-Forwarded-Proto').toLowerCase() === 'https'
    ) {
    return true;
  }
  return false;
}
exports = module.exports = function(req, res, next){
  if(!isSecure(req)){
    var httpsPort = req.app.get('httpsPort') || 443;
    var fullUrl = parseUrl('http://' + req.header('Host') + req.url);
    res.redirect(301, 'https://' + fullUrl.hostname + ':' + httpsPort + req.url);
  } else {
    next();
  }
}
