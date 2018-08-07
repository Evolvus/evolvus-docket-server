const debug = require("debug")("evolvus-docket-server:routes:api");
const _ = require("lodash");
const docket = require("@evolvus/evolvus-docket");
const moment = require('moment');

const LIMIT = process.env.LIMIT || 20;
const PAGE_SIZE = 20;
const ORDER_BY = process.env.ORDER_BY || {
  eventDateTime: -1
};

const auditAttributes = ["name", "createdBy", "application", "source", "ipAddress", "level",
  "status", "eventDateTime", "details", "keywords", "keyDataAsJSON", "eventCode"
];

module.exports = (router) => {

  router.route("/audit")
    .post((req, res, next) => {
      // put the logic here to write to the database
      // this is what all applications call to save
      // audit events
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };
      try {
        let body = _.pick(req.body, auditAttributes);
        var date = body.eventDateTime;
        body.eventDateTime = moment(new Date(date)).toISOString();
        body.status = body.status.toUpperCase();
        debug("request body is: ", JSON.stringify(body));
        docket.save(body)
          .then((savedAudit) => {
            response.status = "200";
            response.description = `Audit saved successfully`;
            response.data = savedAudit;
            debug(`Response is: ${JSON.stringify(response)}`);
            res.status(200).json(response);
          })
          .catch((e) => {
            response.status = "400";
            response.description = `Failed to save`;
            response.data = {};
            res.status(400)
              .send(e);
          });
      } catch (error) {
        debug(`try catch failed:${error}`)
        res.status(400).send(error.message);
      }
    })
    .get((req, res, next) => {
      const response = {
        "status": "200",
        "description": "",
        "data": {}
      };
      debug("query: " + JSON.stringify(req.query));
      var limit = _.get(req.query, "limit", LIMIT);
      // var pageSize = _.get(req.query, "pageSize", PAGE_SIZE);
      // var pageNo = _.get(req.query, "pageNo", 1);
      // var skipCount = (pageNo - 1) * pageSize;

      var filter = _.omitBy(req.query, function(value, key) {
        return value.startsWith("undefined");
      });
      var sort = _.get(req.query, "sort", {});
      var orderby = sortable(sort);
      var skipCount = 0;
      // limit = +pageSize > +limit ? +limit : +pageSize;

      try {
        docket.find(filter, orderby, skipCount, +limit)
          .then((result) => {
            if (result.length > 0) {
              response.status = "200";
              response.description = "Records found";
              response.data = result;
              response.totalNoOfRecords = result.length;
              debug("response: " + JSON.stringify(response));
              res.status(200).json(response);
            } else {
              response.status = "200";
              response.data = [];
              response.description = "No Audit data available";
              debug("response: " + JSON.stringify(response));
              res.status(200).json(response);
            }
          }).catch((e) => {
            debug(`failed to fetch all Audits ${e}`);
            response.status = "400";
            response.description = `Unable to fetch all Audits due to ${e}`;
            response.data = [];
            res.status(400).json(response);
          });
      } catch (e) {
        response.status = "400";
        response.description = `Unable to fetch all Users due to ${e}`;
        response.data = [];
        debug("response: " + JSON.stringify(response));
        res.status(400).json(response);
      }
    });

  // router.get('/rowDetails', (req, res, next) => {
  //   //get a audit by id parameter and diplays it in a dialog box
  //   docket.getById(req.query.id)
  //     .then((doc) => {
  //       res.render('pages/row', {
  //         docket: doc
  //       });
  //     }).catch((e) => {
  //       res.status(400).send(e);
  //     });
  // });
  //
  // router.get('/topNoOfRecords', (req, res, next) => {
  //   // get the limited audit records and displays it in a timeline
  //   docket.getByLimit(parseInt(req.query.value))
  //     .then((docs) => {
  //       res.render('partials/body', {
  //         auditRecords: docs
  //       });
  //     }).catch((e) => {
  //       res.status(400).send(e);
  //     });
  // });
  //
  // router.get('/getByFilter', (req, res, next) => {
  //   //filters tha data according to some filter parmateters
  //   var parameter = _.pick(req.query, ['application', 'source', 'level', 'ipAddress', 'createdBy', 'status', 'fromDate', 'toDate']);
  //   docket.getByParameters(parameter).then((docs) => {
  //     if (_.isEmpty(docs)) {
  //       res.json({
  //         message: "Data not available for this criteria"
  //       });
  //     } else {
  //       res.send(docs);
  //     }
  //   }).catch((e) => {
  //     res.status(400).send(e.message);
  //   });
  // });

  router.get('/getFilterOptions', (req, res, next) => {
    try {
      docket.getAll(50)
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



function sortable(sort) {
  if (typeof sort === 'undefined' ||
    sort == null) {
    return ORDER_BY;
  }
  if (typeof sort === 'string') {
    var values = sort.split(",");
    var result = sort.split(",")
      .reduce((temp, sortParam) => {
        if (sortParam.charAt(0) == "-") {
          return _.assign(temp, _.fromPairs([
            [sortParam.replace(/-/, ""), -1]
          ]));
        } else {
          return _.assign(_.fromPairs([
            [sortParam.replace(/\ /, ""), 1]
          ]));
        }
      }, {});
    return result;
  } else {
    return ORDER_BY;
  }
}