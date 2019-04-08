/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const testUser = {
  firstName: 'Dora',
  lastName: 'Ofili',
  email: 'doraofili@yahoo.com',
  password: 'dorasecurepassword',
  type: 'client',
  isAdmin: false,
};

/* eslint-disable no-unused-vars */

describe('Auth Endpoints', () => {
  describe('POST /auth/signup', () => {
    it('should create a new user account', (done) => {
      chai.request(app).post('/api/v1/auth/signup').send(testUser).end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('status').eql(201);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('token');
        res.body.data.token.should.be.a('string');
        res.body.data.should.have.property('firstName');
        res.body.data.firstName.should.be.a('string');
        res.body.data.should.have.property('lastName');
        res.body.data.lastName.should.be.a('string');
        res.body.data.should.have.property('email');
        res.body.data.email.should.be.a('string');
        res.body.data.should.have.property('id');
        res.body.data.id.should.be.an('number');
        done();
      });
    });
    it('should return 400 error if firstname is empty', (done) => {
      const { firstName, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup').send(partialUserDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Firstname is required!');
        done();
      });
    });
    it('should return 400 error if lastname is empty', (done) => {
      const { lastName, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup').send(partialUserDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Lastname is required!');
        done();
      });
    });
    it('should return 400 error if email is empty', (done) => {
      const { email, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup').send(partialUserDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Email is required!');
        done();
      });
    });
    it('should return 400 error if password is empty', (done) => {
      const { password, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup').send(partialUserDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Password is required!');
        done();
      });
    });
    it('should return 400 error if isAdmin is empty', (done) => {
      const { isAdmin, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup').send(partialUserDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('User isAdmin property is required!');
        done();
      });
    });
    it('should return 400 error if user type is empty', (done) => {
      const { type, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup').send(partialUserDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('User type is required!');
        done();
      });
    });
  });
  describe('POST /auth/signin', () => {
    it('should login a user', (done) => {
      chai.request(app).post('/api/v1/auth/signin').send(testUser).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('token');
        res.body.data.token.should.be.a('string');
        res.body.data.should.have.property('firstName');
        res.body.data.firstName.should.be.a('string');
        res.body.data.should.have.property('lastName');
        res.body.data.lastName.should.be.a('string');
        res.body.data.should.have.property('email');
        res.body.data.email.should.be.a('string');
        res.body.data.should.have.property('id');
        res.body.data.id.should.be.an('number');
        done();
      });
    });
    it('should return 400 error if email is empty', (done) => {
      const { email, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signin').send(partialUserDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Email is required!');
        done();
      });
    });
    it('should return 400 error if password is empty', (done) => {
      const { password, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signin').send(partialUserDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Password is required!');
        done();
      });
    });
  });
});
