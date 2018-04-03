module.exports = function(router) {

  require('./login')(router);

  router.use(function(req, res, next) {
    // make sure we go to the next routes and don't stop here
    next();
  });
}
