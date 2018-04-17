const PORT = process.env.PORT || 8080;
const mongoose = require("mongoose");

process.env.MONGO_DB_URL = "mongodb://localhost:27017/TestDocket";
/*
 ** Test /api/audit API's
 */
const debug = require("debug")("evolvus-docket-server.test.routes.api");
const app = require("../../server")
  .app;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

var serverUrl = "http://localhost:" + PORT;

describe('POST /audit', () => {
  let server;
  before((done) => {
    app.on('application_started', done());
  });

  it('valid POST should return object with same attribute values', (done) => {

    let auditEvent = {
      name: 'loginEvent',
      createdBy: 'anisht',
      application: 'CDA',
      source: 'loginPage',
      ipAddress: '127.0.0.1',
      level: 'info',
      status: 'SUCCESS',
      eventDateTime: new Date().toISOString(),
      details: '{ user: "anish" }',
      keywords: 'login CDA',
      keyDataAsJSON: "keydata"
    };

    chai.request(serverUrl)
      .post('/audit')
      .send(auditEvent)
      .end((err, res) => {
        if (err) {
          debug(`error in the test ${err}`);
          done(err);
        } else {
          debug(`response body is ${res.body}`);
          res.should.have.status(200);
          res.body.should.have.property('name')
            .eql(auditEvent.name);
          done();
        }
      });
  });
});