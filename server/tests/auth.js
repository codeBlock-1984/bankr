/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import pool from '../database/db';
import authData from '../testData/users';

chai.use(chaiHttp);
chai.should();

const { testUser } = authData;
const { email: testUserEmail } = testUser;

describe('Auth Endpoints', () => {
  describe('POST /auth/signup', () => {
    it('should create a new user account', (done) => {
      try {
        chai.request(app).post('/api/v1/auth/signup')
          .send(testUser).end((err, res) => {
            res.should.have.status(201);
            res.body.should.have.property('data');
            res.body.data.should.be.an('array');
            res.body.data[0].should.have.property('token');
            res.body.data[0].token.should.be.a('string');
            res.body.data[0].should.have.property('firstname').eql('Dora');
            res.body.data[0].firstname.should.be.a('string');
            res.body.data[0].should.have.property('lastname').eql('Ofili');
            res.body.data[0].lastname.should.be.a('string');
            res.body.data[0].should.have.property('email')
              .eql('doraofili@yahoo.com');
            res.body.data[0].email.should.be.a('string');
            res.body.data[0].should.have.property('id');
            res.body.data[0].id.should.be.an('number');
            res.body.data[0].should.have.property('type').eql('client');
            res.body.data[0].type.should.be.a('string');
            done();
          });
      } catch (error) {
        console.log(error);
      }
    });

    it('should return 400 error if firstname is empty', (done) => {
      const { firstName, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error[0].should.eql('Firstname is required!');
          done();
        });
    });

    it('should return 400 error if lastname is empty', (done) => {
      const { lastName, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error[0].should.eql('Lastname is required!');
          done();
        });
    });
    it('should return 400 error if email is empty', (done) => {
      const { email, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error[0].should.eql('Email is required!');
          done();
        });
    });
    it('should return 400 error if password is empty', (done) => {
      const { password, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error[0].should.eql('Password is required!');
          done();
        });
    });
  });

  describe('POST /auth/signin', () => {
    it('should login a user', (done) => {
      const { email, password } = testUser;
      const signinDetails = { email, password };
      try {
        chai.request(app).post('/api/v1/auth/signin')
          .send(signinDetails)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('data');
            res.body.data.should.be.an('array');
            res.body.data[0].should.have.property('token');
            res.body.data[0].token.should.be.a('string');
            res.body.data[0].should.have.property('firstname').eql('Dora');
            res.body.data[0].firstname.should.be.a('string');
            res.body.data[0].should.have.property('lastname').eql('Ofili');
            res.body.data[0].lastname.should.be.a('string');
            res.body.data[0].should.have.property('email')
              .eql('doraofili@yahoo.com');
            res.body.data[0].email.should.be.a('string');
            res.body.data[0].should.have.property('id');
            res.body.data[0].id.should.be.an('number');
            res.body.data[0].should.have.property('type').eql('client');
            res.body.data[0].type.should.be.a('string');
            done();
          });
      } catch (error) {
        console.log(error);
      }
    });

    it('should return 400 error if email is empty', (done) => {
      const { email, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signin')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error[0].should.eql('Email is required!');
          done();
        });
    });

    it('should return 400 error if password is empty', (done) => {
      const { password, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signin')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error[0].should.eql('Password is required!');
          done();
        });
    });
  });

  after('Remove new user account', async () => {
    const client = await pool.connect();
    try {
      const removeUserQuery = `DELETE FROM users WHERE email = $1 `;
      const value = [testUserEmail];
      await client.query(removeUserQuery, value);
    } catch (error) {
      console.log(error);
    } finally {
      await client.release();
    }
  });
});
