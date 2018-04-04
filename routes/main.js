module.exports = function(router) {

  require('./api')(router);
  require('./login')(router);
  require('./register')(router);

  router.use(function(req, res, next) {
    // make sure we go to the next routes and don't stop here
    next();
  });
};
