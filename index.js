var parseUrl = require('url').parse;
var assign = require('lodash.assign');

function isSecure (secure, xfpHeader, trustXFPHeader) {
  xfpHeader = xfpHeader ? xfpHeader.toString().toLowerCase() : '';
  if (secure) {
    return true;
  }

  return trustXFPHeader && xfpHeader === 'https'
}

function shouldRedirect (redirectsEnabled, method) {
  if (!redirectsEnabled) {
    return false
  }

  return method === "GET";
}

function checkForDeprecation (appSettings, optionsHttpsPort) {
  var httpsPort = appSettings.get('httpsPort');

  if (appSettings.get('env') === 'development') {
    if (httpsPort) {
      console.warn('express-force-ssl deprecated: app.set("httpsPort", ' + httpsPort + '), use ' +
        'app.set("forceSSLOptions", { httpsPort: ' + httpsPort + ' }) instead.');
    }

    if (httpsPort && optionsHttpsPort) {
      console.warn('You have set both app.get("httpsPort") and app.get("forceSSLOptions").httpsPort ' +
        'Your app will use the value in forceSSLOptions.');
    }
  }
}

module.exports = function(req, res, next){
  var redirect;
  var secure;
  var xfpHeader = req.get('X-Forwarded-Proto');
  var localHttpsPort;
  var appHttpsPort = req.app.get('httpsPort');
  var httpsPort;
  var fullUrl;
  var redirectUrl;

  var options = {
    trustXFPHeader: false,
    enable301Redirects: true,
    httpsPort: false,
    sslRequiredMessage: 'SSL Required.'
  };

  var expressOptions = req.app.get('forceSSLOptions') || {};
  var localOptions = res.locals.forceSSLOptions || {};
  localHttpsPort = localOptions.httpsPort;
  assign(options, expressOptions, localOptions);

  secure = isSecure(req.secure, xfpHeader, options.trustXFPHeader);
  redirect = shouldRedirect(options.enable301Redirects, req.method);

  if (!secure) {
    if (redirect) {
      checkForDeprecation(req.app, options.httpsPort);

      httpsPort = localHttpsPort || options.httpsPort || appHttpsPort || 443;
      fullUrl = parseUrl(req.protocol + '://' + req.header('Host') + req.originalUrl);

      //intentionally allow coercion of https port
      redirectUrl = 'https://' + fullUrl.hostname + (httpsPort == 443 ? '' : (':' + httpsPort)) + req.originalUrl;

      res.redirect(301, redirectUrl);
    } else {
      res.status(403).send(options.sslRequiredMessage);
    }
  } else {
    delete res.locals.forceSSLOptions;
    next();
  }
};
