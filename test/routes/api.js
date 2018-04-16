/*
 ** Test /api/audit API's
 */
const debug = require("debug")("evolvus-docket-server.test.routes.api");

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

const serverUrl = 'http://localhost:8080';
const mongoose = require("mongoose");
var MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost/TestDB";

// describe('GET /audit', () => {
//   it('get should return array of string', (done) => {
//
//     chai.request(serverUrl)
//       .get('/audit')
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.be.a('array');
//         done();
//       });
//   });
// });


describe('POST /audit', () => {
  before((done) => {
    mongoose.connect(MONGO_DB_URL);
    let connection = mongoose.connection;
    connection.once("open", () => {
      debug("ok got the connection");
      done();
    });
  });


  it('valid POST should return object with same attribute values', (done) => {
    // const auditAttributes = ['name', 'createdBy', 'application', 'source', 'ipAddress', 'level',
    //   'createdBy', 'status', 'eventDateTime', 'details', 'keywords'
    // ];
    let auditEvent = {
      name: 'loginEvent',
      createdBy: 'anisht',
      application: 'CDA',
      source: 'loginPage',
      ipAddress: '127.0.0.1',
      level: 'info',
      status: 'SUCCESS',
      eventDateTime: "new Date().toISOString()",
      details: '{ user: "anish" }',
      keywords: 'login CDA',
      keyDataAsJSON: "keydata"
    };

    chai.request(serverUrl)
      .post('/audit')
      .send(auditEvent)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.equal(true);
        // res.body.should.have.property('name')
        // .eql(auditEvent.source);
        done();
      });
  });
});