const debug = require('debug')('evolvus-docket-server:routes:login');
const _ = require('lodash');
var {
  User,
  dbUrl
} = require('evls-user-demo');
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
      User.findByCredentials(body.email, body.password).then((user) => {
        user.generateAuthToken().then((token) => {
          localStorage.setItem('token', token);
          res.status(302).redirect('/docket');
        });
      }).catch((e) => {
        res.status(401).render('pages/single', {
          message: e,
          loggedIn: false
        });
      });
    });

};