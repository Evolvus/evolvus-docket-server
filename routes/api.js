const debug = require("debug")("evolvus-docket-server:routes:api");
const _ = require("lodash");
const docket = require("evolvus-docket");
const moment = require('moment');

const auditAttributes = ["name", "createdBy", "application", "source", "ipAddress", "level",
  "status", "eventDateTime", "details", "keywords", "keyDataAsJSON"
];

module.exports = (router) => {

  router.route("/audit")
    .post((req, res, next) => {
      // put the logic here to write to the database
      // this is what all applications call to save
      // audit events
      //debug("body is", JSON.stringify(req));
      try {
        let body = _.pick(req.body, auditAttributes);
        var date = body.eventDateTime;
        body.eventDateTime = moment(new Date(date)).toISOString();
        body.status = body.status.toUpperCase();
        debug("request body is: ", JSON.stringify(body));
        docket.validate(body)
          .then((result) => {
            if (result) {
              docket.save(body)
                .then((doc) => {
                  res.send(doc);
                })
                .catch((e) => {
                  res.status(400)
                    .send(e);
                });
            } else {
              debug("validation failed");
              res.send('validation failed');
            }
          });
      } catch (error) {
        res.status(400).send(error.message);
      }
    })
    .get((req, res, next) => {
      //it will fetch all the records from database
      try {
        docket.getAll()
          .then((records) => {
            records = records.reverse();
            res.send(records);
          }).catch((e) => {
            res.status(400).send(e);
          });
      } catch (e) {
        res.status(400).send(e);
      }
    });

  router.get('/rowDetails', (req, res, next) => {
    //get a audit by id parameter and diplays it in a dialog box
    docket.getById(req.query.id)
      .then((doc) => {
        res.render('pages/row', {
          docket: doc
        });
      }).catch((e) => {
        res.status(400).send(e);
      });
  });

  router.get('/topNoOfRecords', (req, res, next) => {
    // get the limited audit records and displays it in a timeline
    docket.getByLimit(parseInt(req.query.value))
      .then((docs) => {
        res.render('partials/body', {
          auditRecords: docs
        });
      }).catch((e) => {
        res.status(400).send(e);
      });
  });

  router.get('/getByFilter', (req, res, next) => {
    //filters tha data according to some filter parmateters
    var parameter = _.pick(req.query, ['application', 'source', 'level', 'ipAddress', 'createdBy', 'status', 'fromDate', 'toDate']);
    if (typeof parameter.fromDate !== 'undefined' && typeof parameter.toDate !== 'undefined') {
      parameter.fromDate = moment(new Date(parameter.fromDate)).toString();
      parameter.toDate = moment(new Date(parameter.toDate)).toString();
    }
    docket.getByParameters(parameter).then((docs) => {
      if (docs) {
        res.send(docs);
      } else {
        res.send({});
      }
      // res.render('pages/table', {
      //   auditRecords: docs
      // });
    }).catch((e) => {
      res.status(400).send(e.message);
    });
  });

  router.get('/getFilterOptions', (req, res, next) => {
    try {
      docket.getAll()
        .then((records) => {
          var application = _.uniq(_.map(records, 'application'));
          var source = _.uniq(_.map(records, 'source'));
          var createdBy = _.uniq(_.map(records, 'createdBy'));
          var ipAddress = _.uniq(_.map(records, 'ipAddress'));
          var status = _.uniq(_.map(records, 'status'));
          var level = _.uniq(_.map(records, 'level'));
          var filterOptions = {
            applicationOptions: application,
            sourcesOptions: source,
            ipAddressOptions: ipAddress,
            createdByOptions: createdBy,
            statusOptions: status,
            levelOptions: level
          };
          res.send(filterOptions);
        }).catch((e) => {
          res.status(400).send(e);
        });
    } catch (e) {
      res.status(400).send(e);
    }
  });
};