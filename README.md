express-force-ssl
=================
Extremely simple middleware for requiring some or all pages
to be visited over SSL.


####Installation
````
$ npm install express-force-ssl
````


####Examples
######Force SSL on all pages
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
app.use(forceSSL);
app.use(app.router);

secureServer.listen(443)
server.listen(80)

```

######Only certain pages SSL
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
var secureServer = https.createServer(options, app);

app.use(express.bodyParser());
app.use(app.router);

app.get('/', somePublicFunction);
app.get('/user/:name', somePublicFunction);
app.get('/login', forceSSL, someSecureFunction);
app.get('/logout', forceSSL, someSecureFunction);

secureServer.listen(443)
server.listen(80)
```

######Custom Server Port Support
If your server isn't listening on 80/443 respectively, you can change this pretty simply. 

```javascript

var app = express();
app.set('httpsPort', 8443);

var server = http.createServer(app);
var secureServer = https.createServer(options, app);

...

secureServer.listen(443)
server.listen(80)

```


###Change Log
####v0.2.2 - Redirect now gives a 301 permanent redirection HTTP Status Code
Courtesy of @tixz 

####v0.2.0 - Added support for ports other than 80/443 for non-secure/secure ports.
For example, if you host your non-ssl site on port 8080 and your secure site on 8443, version 0.1.x did not support it.
Now, out of the box your non-ssl site port will be recognized, and to specify a port other than 443 for your ssl port
you just have to add a setting in your express config like so:
````javascript
app.set('httpsPort', 8443);
````
and the plugin will check for it and use it. Defaults to 443 of course.

####v0.1.1 - Bug fix
Curteousy of @timshadel
