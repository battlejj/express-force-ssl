express-force-ssl
=================
Extremely simple middleware for requiring some or all pages
to be visited over SSL.


Installation
------------
````
$ npm install express-force-ssl
````


Examples
========
Force SSL on all pages
----------------------
```javascript
var express = require('express');
var forceSSL = require('express-force-ssl')();
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
app.use(forceSSL);
app.use(app.router);

secureServer.listen(443)
server.listen(80)
```

Only certain pages SSL
----------------------
```javascript
var express = require('express');
var forceSSL = require('express-force-ssl')();
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
var forceSSL = require('express-force-ssl')({ port: 8443 });

var app = express();

var server = http.createServer(app);
var secureServer = https.createServer(ssl_options, app);

...

secureServer.listen(8443)
server.listen(80)
```

Custom Error Response
--------------------------
You can change the default 403 response message by setting the `errorResponse` option like so:

```javascript
var forceSSL = require('express-force-ssl')({ errorResponse: 'SSL really required.' });
```

Test
----
```
npm test
```

Change Log
==========
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

````javascript
app.set('httpsPort', 8443);
````
and the plugin will check for it and use it. Defaults to 443 of course.

**v0.1.1** - Bug fix
Courtesy of @timshadel
