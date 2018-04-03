const debug = require('debug')('evolvus-docket-server:routes:login');

module.exports = (router) => {

  router.route('/login')
    .get((req, res, next) => {
      let page = 'pages/single';
      debug('lets try to render page', page);

      res.render(page, {
        message: "",
        loggedIn: false
      });
    });

}
