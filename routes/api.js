const debug = require('debug')('evolvus-docket-server:routes:api');

module.exports = (router) => {

  router.route('/api/audit')
    .post((req, res, next) => {
      // put the logic here to write to the database
      // this is what all applications call to save
      // audit events
    });

}
