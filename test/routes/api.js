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


describe('Testing routes', () => {
  var id;
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
            id = res.body._id;
            debug(`response body is ${res.body}`);
            res.should.have.status(200);
            res.body.should.have.property('name')
              .eql(auditEvent.name);
            done();
          }
        });
    });
  });

  describe('testing GET /audit', () => {

    it('should return status 200', (done) => {
      chai.request(serverUrl)
        .get('/audit')
        .end((err, res) => {
          if (err) {
            debug(`error in the test ${err}`);
            done(err);
          } else {
            res.should.have.status(200);
            done();
          }
        });
    });
  });

  describe('testing GET /rowDetails', () => {

    it('should return status 200', (done) => {
      chai.request(serverUrl)
        .get('/rowDetails')
        .query({
          id: id
        })
        .end((err, res) => {
          if (err) {
            debug(`error in the test ${err}`);
            done(err);
          } else {
            res.should.have.status(200);
            done();
          }
        });
    });
  });

  describe('testing GET /topNoOfRecords', () => {

    it('should return status 200', (done) => {
      chai.request(serverUrl)
        .get('/topNoOfRecords')
        .query({
          value: 1
        })
        .end((err, res) => {
          if (err) {
            debug(`error in the test ${err}`);
            done(err);
          } else {
            res.should.have.status(200);
            done();
          }
        });
    });
  });

  describe('testing GET /getByFilter', () => {

    it('should return status 200', (done) => {
      chai.request(serverUrl)
        .get('/getByFilter')
        .end((err, res) => {
          if (err) {
            debug(`error in the test ${err}`);
            done(err);
          } else {
            res.should.have.status(200);
            done();
          }
        });
    });
  });
});