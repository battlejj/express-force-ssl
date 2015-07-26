var parseUrl = require('url').parse;

var isSecure = function(req) {
  var options = req.app.get('forceSSLOptions') || {};
  var XFPHeader = (req.get('X-Forwarded-Proto') || '').toLowerCase();
  if (req.secure) {
    return true;
  } else if (options.trustXFPHeader && XFPHeader === 'https') {
    return true;
  }
  return false;
};

module.exports = function(req, res, next){

  var options = {
    trustXFPHeader: false,
    enable301Redirects: true,
    httpsPort: false
  };

  var expressOptions = req.app.get('forceSSLOptions') || {};

  for(var i in options){
    if(options.hasOwnProperty(i) && Object.keys(res.locals).indexOf(i) > -1){
      options[i] = res.locals[i];
    } else if(options.hasOwnProperty(i) && expressOptions.hasOwnProperty(i)){
      options[i] = expressOptions[i];
    }
  }

  if(!isSecure(req)){
    if(req.method === "GET" && options.enable301Redirects){
      if(req.app.get('env') === 'development') {
        if (req.app.get('httpsPort')) {
          console.warn('express-force-ssl deprecated: app.set("httpsPort", ' + req.app.get('httpsPort') + '), use ' +
            'app.set("forceSSLOptions", { httpsPort: ' + req.app.get('httpsPort') + ' }) instead.');
        }

        if(req.app.get('httpsPort') && options.httpsPort){
          console.warn('You have set both app.get("httpsPort") and app.get("forceSSLOptions").httpsPort ' +
            'Your app will use the value in forceSSLOptions.');
        }
      }
      var httpsPort = res.locals['httpsPort'] || options.httpsPort || req.app.get('httpsPort') || 443;
      var fullUrl = parseUrl(req.protocol + '://' + req.header('Host') + req.originalUrl);
      //intentionally allow coercion of https port
      var redirectUrl = 'https://' + fullUrl.hostname + (httpsPort == 443 ? '' : (':' + httpsPort)) + req.originalUrl;
      res.redirect(301, redirectUrl);
    } else {
      res.status(403).send('SSL Required.');
    }
  } else {
    next();
  }
};
