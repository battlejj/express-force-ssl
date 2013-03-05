express-force-ssl
=================
####Only tested on express 3.x

Extremely simple middleware for requiring some or all pages
to be visited over SSL.


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
app.use sslRequirement
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