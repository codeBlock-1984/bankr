/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import userData from '../testData/users';

chai.use(chaiHttp);
chai.should();

let testUserId;
const noId = 133;
const { testUserData } = userData;

describe('Users Endpoints', () => {
  describe('GET /users/:userId', () => {
    before('seed users dummy data', async () => {
      const response = await chai.request(app).post('/api/v1/auth/signup').send(testUserData);
      testUserId = response.body.data.id;
    });
    it('should get a single user with the specified id', (done) => {
      chai.request(app).get(`/api/v1/users/${testUserId}`).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('firstName');
        res.body.data.firstName.should.be.a('string');
        res.body.data.should.have.property('lastName');
        res.body.data.lastName.should.be.a('string');
        res.body.data.should.have.property('email');
        res.body.data.email.should.be.a('string');
        res.body.data.should.have.property('password');
        res.body.data.password.should.be.a('string');
        res.body.data.should.have.property('isAdmin');
        res.body.data.isAdmin.should.be.a('boolean');
        res.body.data.should.have.property('type');
        res.body.data.type.should.be.a('string');
        res.body.data.should.have.property('id');
        res.body.data.id.should.be.an('number');
        done();
      });
    });
    it('should return a 404 error if id is not found', (done) => {
      chai.request(app).get(`/api/v1/users/${noId}`).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('User with specified id not found!');
        done();
      });
    });
  });
  describe('GET /users', () => {
    it('should get all users', (done) => {
      chai.request(app).get('/api/v1/users').end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        done();
      });
    });
  });
  describe('GET /users/:userId/accounts', () => {
    it('should get user accounts by user id', (done) => {
      chai.request(app).get(`/api/v1/users/1/accounts`).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        done();
      });
    });
  });
  describe('GET /users/:userId/transactions', () => {
    it('should get user transactions by user id', (done) => {
      chai.request(app).get(`/api/v1/users/1/transactions`).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        done();
      });
    });
  });
});
