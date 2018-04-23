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
      } catch (e) {
        res.status(400)
          .send(e);
      }
    })
    .get((req, res, next) => {
      //it will fetch all the records from database
      try {
        docket.getAll()
          .then((records) => {
            records = records.reverse();
            var application = _.uniqBy(records, (audit) => {
              return audit.application;
            });
            var source = _.uniqBy(records, (audit) => {
              return audit.source;
            });
            var ipAddress = _.uniqBy(records, (audit) => {
              return audit.ipAddress;
            });
            var level = _.uniqBy(records, (audit) => {
              return audit.level;
            });
            var createdBy = _.uniqBy(records, (audit) => {
              return audit.createdBy;
            });
            var status = _.uniqBy(records, (audit) => {
              return audit.status;
            });
            res.render('pages/single', {
              loggedIn: true,
              auditRecords: records,
              application,
              source,
              ipAddress,
              level,
              status,
              createdBy
            });
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
    var parameter = _.pick(req.query, ['application', 'source', 'ipAddress', 'createdBy', 'fromDate', 'toDate', 'level', 'status']);
    if (typeof parameter.fromDate !== 'undefined' && typeof parameter.toDate !== 'undefined') {
      parameter.fromDate = new Date(moment(parameter.fromDate, "DD/MM/YYYY").format("MM/DD/YYYY"));
      parameter.toDate = new Date(moment(parameter.toDate, "DD/MM/YYYY").format("MM/DD/YYYY"));
    }
    docket.getByParameters(parameter).then((docs) => {
      res.render('pages/table', {
        auditRecords: docs
      });
    }).catch((e) => {
      res.status(400).send(e);
    });
  });
};