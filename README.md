express-force-ssl
=================
Extremely simple middleware for requiring some or all pages
to be visited over SSL.


Installation
------------
````
$ npm install express-force-ssl
````

Configuration
=============
As of v0.3.0 there are some configuration options
-------------------------------------------------

**NEW Settings Option**
```javascript
app.set('forceSSLOptions', {
  enable301Redirects: true,
  trustXFPHeader: false,
  httpsPort: 443,
  sslRequiredMessage: 'SSL Required.'
});
```


**enable301Redirects** - Defaults to ***true*** - the normal behavior is to 301 redirect GET requests to the https version of a
website. Changing this value to ***false*** will cause even GET requests to 403 SSL Required errors.

**trustXFPHeader** - Defaults to ***false*** - this behavior is NEW and will be default NOT TRUST X-Forwarded-Proto which
could allow a client to spoof whether or not they were on HTTPS or not. This can be changed to ***true*** if you are
behind a proxy where you trust the X-Forwarded-Proto header.

**httpsPort** - Previous this value was set with app.set('httpsPort', :portNumber) which is now deprecated. This value
should now be set in the forceSSLOptions setting.

**sslRequiredMessage** - Defaults to ***SSL Required.*** This can be useful if you want to localize your error messages.

Per-Route SSL Settings are now possible
---------------------------------------
Settings in your forceSSLOptions configuration will act as default settings for your app. However, these values can
be overridden by setting *res.locals* values before the the express-force-ssl middleware is run. For example:

```javascript
app.set('forceSSLOptions', {
  enable301Redirects: false
});

app.get('/', forceSSL, function (req, res) {
  //this route will 403 if accessed via HTTP
  return res.send('HTTPS only.');
});

function allow301 (req, res, next) {
  res.locals.forceSSLOptions = {
    enable301Redirects: true
  };
  next();
}

app.get('/allow', allow301, forceSSL, function (req, res) {
  //this route will NOT 403 if accessed via HTTP
  return res.send('HTTP or HTTPS');
});

```



Examples
========
Force SSL on all pages
----------------------
```javascript
var express = require('express');
var forceSSL = require('express-force-ssl');
var fs = require('fs');
var http = require('http');
var https = require('https');

var ssl_options = {
  key: fs.readFileSync('./keys/private.key'),
  cert: fs.readFileSync('./keys/cert.crt'),
  ca: fs.readFileSync('./keys/intermediate.crt')
};

var app = express();
var server = http.createServer(app);
var secureServer = https.createServer(ssl_options, app);

app.use(express.bodyParser());
app.use(forceSSL);
app.use(app.router);

secureServer.listen(443)
server.listen(80)

```

Only certain pages SSL
----------------------
```javascript
var express = require('express');
var forceSSL = require('express-force-ssl');
var fs = require('fs');
var http = require('http');
var https = require('https');

var ssl_options = {
  key: fs.readFileSync('./keys/private.key')
  cert: fs.readFileSync('./keys/cert.crt')
  ca: fs.readFileSync('./keys/intermediate.crt')
};

var app = express();

var server = http.createServer(app);
var secureServer = https.createServer(ssl_options, app);

app.use(express.bodyParser());
app.use(app.router);

app.get('/', somePublicFunction);
app.get('/user/:name', somePublicFunction);
app.get('/login', forceSSL, someSecureFunction);
app.get('/logout', forceSSL, someSecureFunction);

secureServer.listen(443)
server.listen(80)
```

Custom Server Port Support
--------------------------
If your server isn't listening on 80/443 respectively, you can change this pretty simply.

```javascript

var app = express();
app.set('forceSSLOptions', {
  httpsPort: 8443
});

var server = http.createServer(app);
var secureServer = https.createServer(ssl_options, app);

...

secureServer.listen(443)
server.listen(80)

```

Test
----
```
npm test
```

Change Log
==========
**v0.3.2** - Updated README to remove typo. Thanks @gswalden

**v0.3.1** - Updated README to remove deprecated usage and fix some typos. Thanks @Alfredo-Delgado and @glennr

**v0.3.0** - Added additional configuration options, ability to add per route configuration options

**v0.2.13** - Bug Fix, thanks @tatepostnikoff

**v0.2.12** - Bug Fix

**v0.2.11** - Updated README to fix usage example typo and formatting fixes

**v0.2.10** - Updated README for npmjs.com markdown changes

**v0.2.9** - More modular tests.

**v0.2.8** - Now sends 403 SSL Required error when HTTP method is anything but GET.
This will prevent a POST/PUT etc with data that will end up being lost in a redirect.

**v0.2.7** - Additional Test cases. Added example server.

**v0.2.6** - Added Tests

**v0.2.5** - Bug Fix

**v0.2.4** - Now also checking X-Forwarded-Proto header to determine SSL connection
Courtesy of @ronco

**v0.2.3** - Update README

**v0.2.2** - Redirect now gives a 301 permanent redirection HTTP Status Code
Courtesy of @tixz

**v0.2.0** - Added support for ports other than 80/443 for non-secure/secure ports.
For example, if you host your non-ssl site on port 8080 and your secure site on 8443, version 0.1.x did not support it.
Now, out of the box your non-ssl site port will be recognized, and to specify a port other than 443 for your ssl port
you just have to add a setting in your express config like so:
**Update, this method of setting httpsPort is deprecated as of v 0.3.0**

````javascript
app.set('httpsPort', 8443);
````
and the plugin will check for it and use it. Defaults to 443 of course.

**v0.1.1** - Bug fix
Courtesy of @timshadel
