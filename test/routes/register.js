const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");

process.env.MONGO_DB_URL = "mongodb://localhost:27017/TestDocket";
/*
 ** Test /api/audit API's
 */
const debug = require("debug")("evolvus-docket-server.test.routes.login");
const app = require("../../server")
  .app;

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

var serverUrl = "http://localhost:" + PORT;

describe('Testing regisetr', () => {

  before((done) => {
    app.on('application_started', done());
  });

  describe('GET /register', () => {
    it('should render page successfully', (done) => {
      chai.request(serverUrl)
        .get('/register')
        .end((err, res) => {
          if (err) {
            debug(`error in the test ${err}`);
          } else {
            debug('rendered successfully');
            res.should.have.status(200);
            done();
          }
        });
    });
  });

  describe("POST /register", () => {
    it('sholud login a valid user', (done) => {
      chai.request(serverUrl)
        .post('/register')
        .send({
          username: 'kavya',
          email: 'kavya@gmail.com',
          password: '*Evolvus5'
        })
        .end((err, res) => {
          if (err) {
            debug(`error in test ${err}`);
          } else {
            res.status.should.equal(200);
            res.req.path.should.equal('/login');
            done();
          }
        });
    });

    it('sholud not save user and redirect to register page', (done) => {
      chai.request(serverUrl)
        .post('/register')
        .send({
          ussername: 'kavya',
          email: 'kavya@gmail.com',
          password: '*Evolvus5'
        })
        .end((err, res) => {
          if (err) {
            debug(`error in test ${err}`);
          } else {
            res.status.should.equal(200);
            res.req.path.should.equal('/register');
            done();
          }
        });
    });
  });
});