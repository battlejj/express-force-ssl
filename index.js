exports = module.exports = function(req, res, next){
  if(!req.secure){
    res.redirect('https://' + req.header('Host') + req.url);
  } else {
    next();
  }
}
