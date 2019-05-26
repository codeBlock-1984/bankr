/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import signInData from '../testData/users';

chai.use(chaiHttp);
chai.should();

const testUserId = 1;
const noId = 1033;

const { testUserTwo, admin } = signInData;

const { email: testUserEmail, } = testUserTwo;

let adminToken;
let clientToken;

describe('Users Endpoints', () => {
  before('Get request tokens', async () => {
    try {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin').send(admin);
      adminToken = res.body.data[0].token;
    } catch (error) {
      console.log(error);
    }
  });

  describe('GET /users/:userId', () => {
    it('should get a single user with the specified id', (done) => {
      chai.request(app).get(`/api/v1/users/${testUserId}`)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('firstName').eql('Alice');
          res.body.data[0].firstName.should.be.a('string');
          res.body.data[0].should.have.property('lastName').eql('Nwankwo');
          res.body.data[0].lastName.should.be.a('string');
          res.body.data[0].should.have.property('email')
            .eql('emmanuelroic@gmail.com');
          res.body.data[0].email.should.be.a('string');
          res.body.data[0].should.have.property('isAdmin').eql(false);
          res.body.data[0].isAdmin.should.be.a('boolean');
          res.body.data[0].should.have.property('type').eql('client');
          res.body.data[0].type.should.be.a('string');
          res.body.data[0].should.have.property('id').eql(1);
          res.body.data[0].id.should.be.an('number');
          done();
        });
    });

    it('should return a 404 error if id is not found', (done) => {
      chai.request(app).get(`/api/v1/users/${noId}`)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error')
            .eql('User with specified id not found!');
          done();
        });
    });
  });

  describe('GET /users', () => {
    it('should get all users', (done) => {
      chai.request(app).get('/api/v1/users')
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('firstname').eql('Alice');
          res.body.data[0].firstname.should.be.a('string');
          res.body.data[0].should.have.property('lastname').eql('Nwankwo');
          res.body.data[0].lastname.should.be.a('string');
          res.body.data[0].should.have.property('email')
            .eql('emmanuelroic@gmail.com');
          res.body.data[0].email.should.be.a('string');
          res.body.data[0].should.have.property('isadmin').eql(false);
          res.body.data[0].isadmin.should.be.a('boolean');
          res.body.data[0].should.have.property('type').eql('client');
          res.body.data[0].type.should.be.a('string');
          res.body.data[0].should.have.property('id');
          res.body.data[0].id.should.be.an('number');
          done();
        });
    });
  });

  describe('POST /users', () => {
    it('should create a new user account', (done) => {
      chai.request(app).post('/api/v1/users')
        .send(testUserTwo)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('firstName').eql('Auwal');
          res.body.data[0].firstName.should.be.a('string');
          res.body.data[0].should.have.property('lastName').eql('Mohammed');
          res.body.data[0].lastName.should.be.a('string');
          res.body.data[0].should.have.property('email')
            .eql('mohammeda@gmail.com');
          res.body.data[0].email.should.be.a('string');
          res.body.data[0].should.have.property('userPassword').eql('user123');
          res.body.data[0].userPassword.should.be.a('string');
          res.body.data[0].should.have.property('type').eql('cashier');
          res.body.data[0].type.should.be.a('string');
          res.body.data[0].should.have.property('id');
          res.body.data[0].id.should.be.an('number');
          done();
        });
    });

    it('should throw a 409 error if email already exists', (done) => {
      chai.request(app).post('/api/v1/users')
        .send(testUserTwo)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(409);
          res.body.should.have.property('error')
            .eql('Email linked to existing user!');
          res.body.error.should.be.an('string');
          done();
        });
    });
  });

  describe('PATCH /users/password', () => {
    before('Get request token', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/signin')
          .send({ email: testUserEmail, password: 'user123' });
        clientToken = res.body.data[0].token;
      } catch (error) {
        console.log(error);
      }
    });

    it(`should update a user's account password`, (done) => {
      chai.request(app).patch(`/api/v1/users/password`)
        .send({ oldPassword: 'user123', newPassword: 'newpassword' })
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message')
            .eql('Password successfully changed.');
          res.body.message.should.be.a('string');
          done();
        });
    });

    it('should throw a 400 error if password is incorrect', (done) => {
      chai.request(app).patch(`/api/v1/users/password`)
        .send({ oldPassword: 'user124', newPassword: 'newpassword' })
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error')
            .eql('Password is incorrect!');
          res.body.error.should.be.an('string');
          done();
        });
    });
  });

  describe('PATCH /users/photo', () => {
    it(`should update a user's account photo`, (done) => {
      chai.request(app).patch(`/api/v1/users/photo`)
        .send({ photoUrl: 'https://i.pravatar.cc/150?img=3' })
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message')
            .eql('Photo upload successful.');
          res.body.message.should.be.a('string');
          done();
        });
    });

    it('should throw a 500 error if photoUrl is invalid', (done) => {
      chai.request(app).patch(`/api/v1/users/photo`)
        .send({ photoUrl: 'ht//i.pravatar.c/150?img=3' })
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.photoUrl.should.eql('Invalid photo url.');
          res.body.error.photoUrl.should.be.an('string');
          done();
        });
    });
  });

  describe('DELETE /users/:email', () => {
    it('should delete a user account', (done) => {
      chai.request(app).delete(`/api/v1/users/${testUserEmail}`)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          done();
        });
    });

    it('should throw a 404 error if email is not found', (done) => {
      chai.request(app).delete(`/api/v1/users/noemail@gmail.com`)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error')
            .eql('User with specified email not found!');
          res.body.error.should.be.an('string');
          done();
        });
    });
  });
});
