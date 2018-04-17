const debug = require('debug')('evolvus-docket-server:routes:register');
const user = require('evolvus-user');
const _ = require('lodash');
const mongoose = require('mongoose');


module.exports = (router) => {

  router.route('/register')
    .post((req, res, next) => {
      // put the logic here related to registration
      var body = _.pick(req.body, ['username', 'email', 'password']);
      user.register(body).then((result) => {
        res.redirect('/login');
      }).catch((e) => {
        res.redirect('/register');
      });
    })
    .get((req, res, next) => {
      let page = 'pages/register';
      debug('lets try to render page', page);
      res.render(page, {
        message: ""
      });
    });
};