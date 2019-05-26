/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import authData from '../testData/users';

chai.use(chaiHttp);
chai.should();

const { testUser, invalidToken, admin } = authData;
const { email: testUserEmail } = testUser;
let testToken;
let adminToken;

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
            res.body.data[0].should.have.property('firstName').equal('Dora');
            res.body.data[0].firstName.should.be.a('string');
            res.body.data[0].should.have.property('lastName').equal('Ofili');
            res.body.data[0].lastName.should.be.a('string');
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
      chai.request(app).post('/api/v1/auth/signup')
        .send(testUser)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('error');
          res.body.error.should.eql('Email linked to existing user!');
          done();
        });
    });

    it('should return 409 error if email is in use', (done) => {
      const { firstName, ...partialUserDetails } = testUser;
      chai.request(app).post('/api/v1/auth/signup')
        .send(partialUserDetails)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.firstName.should.eql('First name is required.');
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
          res.body.error.lastName.should.eql('Last name is required.');
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
          res.body.error.email.should.eql('Email is required.');
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
          res.body.error.password.should.eql('Password is required.');
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
            testToken = res.body.data[0].token;

            res.should.have.status(200);
            res.body.should.have.property('data');
            res.body.data.should.be.an('array');
            res.body.data[0].should.have.property('token');
            res.body.data[0].token.should.be.a('string');
            res.body.data[0].should.have.property('firstName').eql('Dora');
            res.body.data[0].firstName.should.be.a('string');
            res.body.data[0].should.have.property('lastName').eql('Ofili');
            res.body.data[0].lastName.should.be.a('string');
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
          res.body.error.email.should.eql('Email is required.');
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
          res.body.error.password.should.eql('Password is required.');
          done();
        });
    });

    it('should return 400 error if email is incorrect', (done) => {
      chai.request(app).post('/api/v1/auth/signin')
        .send({ email: 'doraofil@yahoo.com', password: 'dorasecurepassword', })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.eql('Email or password incorrect!');
          done();
        });
    });

    it('should return 400 error if password is incorrect', (done) => {
      chai.request(app).post('/api/v1/auth/signin')
        .send({ email: 'doraofili@yahoo.com', password: 'dorasecurpassword', })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.eql('Email or password incorrect!');
          done();
        });
    });
  });

  describe('POST /auth/validate/token', () => {
    it('should check whether a token is valid', (done) => {
      try {
        chai.request(app).post('/api/v1/auth/validate/token')
          .send({ token: testToken })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.have.property('message');
            res.body.message.should.be.a('string')
              .eql('Token validation successful.');
            done();
          });
      } catch (error) {
        console.log(error);
      }
    });

    it('should return 400 error if token is invalid', (done) => {
      chai.request(app).post('/api/v1/auth/validate/token')
        .send({ token: invalidToken })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.token.should.eql('Invalid token.');
          done();
        });
    });
  });

  after('Remove new user account', async () => {
    try {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin').send(admin);

      adminToken = res.body.data[0].token;
      await chai.request(app).delete(`/api/v1/users/${testUserEmail}`)
        .set('x-auth-token', adminToken);
    } catch (error) {
      console.log(error);
    }
  });
});
