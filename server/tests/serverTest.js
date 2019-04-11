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
  describe("GET /non-existent-route", () => {
    it("should display 404 error page", (done) => {
      chai.request(app).get('/non-existent-route').end((err, res) => {
        res.should.have.status(404);
        done();
      });
    });
  });
  describe("GET /api-docs", () => {
    it("should display api documentation page", (done) => {
      chai.request(app).get('/api-docs').end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });
});
