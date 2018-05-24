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

describe('Testing login', () => {

  before((done) => {
    app.on('application_started', done());
  });

  describe('GET /login', () => {
    it('should render page successfully', (done) => {
      chai.request(serverUrl)
        .get('/login')
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

  describe("POST /login", () => {
    it('sholud login a valid user', (done) => {
      chai.request(serverUrl)
        .post('/login')
        .send({
          username: 'kavya@gmail.com',
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
  });
});