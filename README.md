express-force-ssl
=================
####Only tested on express 3.x

Extremely simple middleware for requiring some or all pages
to be visited over SSL.
####v0.2.0 - Added support for ports other than 80/443 for non-secure/secure ports.

For example, if you host your non-ssl site on port 8080 and your secure site on 8443, version 0.1.x did not support it.
Now, out of the box your non-ssl site port will be recognized, and to specify a port other than 443 for your ssl port
you just have to add a setting in your express config like so:
````javascript
app.use('httpsPort', 8443);
````
and the plugin will check for it and use it. Defaults to 443 of course.

####v0.1.1 - Bug fix; thanks Tim!


####Possible uses
#####All pages SSL
```coffeescript
express = require('express')
forceSSL = require('express-force-ssl')
https = require('https')
http = require('http')

options =
  key: fs.readFileSync('./keys/private.key')
  cert: fs.readFileSync('./keys/cert.crt')
  ca: fs.readFileSync('./keys/intermediate.crt')

secureServer = https.createServer(options, app)
server = http.createServer(app)

app = express()
app.use express.bodyParser()
app.use forceSSL
app.use app.router


secureServer.listen(443)
server.listen(80)

```

#####Only certain pages SSL
```coffeescript
express = require('express')
forceSSL = require('express-force-ssl')
https = require('https')
http = require('http')

options =
  key: fs.readFileSync('./keys/private.key')
  cert: fs.readFileSync('./keys/cert.crt')
  ca: fs.readFileSync('./keys/intermediate.crt')

secureServer = https.createServer(options, app)
server = http.createServer(app)

app = express()
app.use express.bodyParser()
app.use app.router

app.get('/', somePublicFunction)
app.get('/user/:name', somePublicFunction)
app.get('/login', forceSSL, someSecureFunction)
app.get('/logout', forceSSL, someSecureFunction)

secureServer.listen(443)
server.listen(80)

```

There are no tests for this module because you have to have SSL setup correctly on your server in order to
properly test.
