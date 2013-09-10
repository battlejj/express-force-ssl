var parseUrl = require('url').parse;
exports = module.exports = function(req, res, next){
  if(!req.secure){
    var httpsPort = req.app.get('httpsPort') || 443;
    var fullUrl = parseUrl('http://' + req.header('Host') + req.url);
    res.redirect('https://' + fullUrl.hostname + ':' + httpsPort + req.url);
  } else {
    next();
  }
}
