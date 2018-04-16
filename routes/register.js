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
        if (result) {
          res.redirect('/login?message=' + "s");
        } else {
          res.redirect('/register');
        }
      }).catch((e) => {
        res.status(400).send(e);
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