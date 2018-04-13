const debug = require('debug')('evolvus-docket-server:routes:api');
const _ = require('lodash');
const docket = require('evolvus-docket');

const auditAttributes = ['name', 'createdBy', 'application', 'source', 'ipAddress', 'level',
  'status', 'eventDateTime', 'details', 'keywords', 'keyDataAsJSON'
];

module.exports = (router) => {

  router.route('/audit')
    .post((req, res, next) => {
      // put the logic here to write to the database
      // this is what all applications call to save
      // audit events
      //debug('body is', JSON.stringify(req));
      try {
        let body = _.pick(req.body, auditAttributes);
        debug('request body is: ', JSON.stringify(body));
        docket.validate(body).then((result) => {
          console.log("res", res);
          if (result) {
            res.send(body);
          }
        }).catch((e) => {
          res.status(400)
            .send(e);
        });
      } catch (e) {
        res.status(400)
          .send(e);
      }
    })
    .get((req, res, next) => {
      res.send(auditAttributes);
    });

};