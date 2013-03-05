exports = module.exports = function(req, res, next){
  if(req.protocol == 'http'){
    res.redirect('https://' + req.header('Host') + req.url)
    next()
  }
}
