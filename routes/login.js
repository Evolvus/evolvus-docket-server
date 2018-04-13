const debug = require('debug')('evolvus-docket-server:routes:login');
const _ = require('lodash');
const user = require('evolvus-user');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');


module.exports = (router) => {

  router.route('/login')
    .get((req, res, next) => {
      let page = 'pages/single';
      debug('lets try to render page', page);
      res.render(page, {
        message: "",
        loggedIn: false
      });
    })
    .post((req, res, next) => {
      var body = _.pick(req.body, ['email', 'password']);
      user.authenticate(body.email, body.passowrd).then((result) => {
        if (result) {
          res.render('pages/single', {
            message: "",
            loggedIn: true
          });
        } else {
          res.redirect('/login')
        }
      }).catch((e) => {
        res.status(400).send(e);
      });
    });
};