const debug = require('debug')('evolvus-docket-server:routes:register');
var {
  User,
  dbUrl
} = require('evls-user-demo');
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect(dbUrl + '/Userss', (err, db) => {
  if (err) {
    console.log('Failed to connect to the database');
  } else {
    console.log('connected to mongodb');
  }
});

module.exports = (router) => {

  router.route('/register')
    .post((req, res, next) => {
      // put the logic here related to registration
      var body = _.pick(req.body, ['username', 'email', 'password']);
      var user = new User(body);
      user.save().then(() => {
        user.generateAuthToken();
      }).then((token) => {
        res.render('pages/single', {
          message: "Registered Successfully"
        });
      }).catch((e) => {
        res.status(400).render('pages/register', {
          message: e.message
        });
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