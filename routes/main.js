const debug = require('debug')('evolvus-docket-server:routes:main');
module.exports = function(router) {

  require('./login')(router);

  router.use(function(req, res, next) {
    debug('middleware kicks in');
    next(); // make sure we go to the next routes and don't stop here
  });
}
