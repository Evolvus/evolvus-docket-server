/*
 ** Test /api/audit API's
 */
let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();

chai.use(chaiHttp);
const serverUrl = 'http://localhost:8080';


describe('GET /audit', () => {
  it('get should return array of string', (done) => {

    chai.request(serverUrl)
      .get('/audit')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        done();
      });
  });
});

describe('POST /audit', () => {
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
      eventDateTime: new Date()
        .toISOString(),
      details: '{ user: "anish" }',
      keywords: 'login CDA'
    };

    chai.request(serverUrl)
      .post('/audit')
      .send(auditEvent)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('name')
          .eql(auditEvent.name);
        done();
      });
  });
});
