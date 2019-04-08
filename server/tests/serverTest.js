/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

describe("Server", () => {
  describe("GET /", () => {
    it("should display home page", (done) => {
      chai.request(app).get('/').end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });
});
