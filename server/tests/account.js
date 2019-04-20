/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import accountData from '../testData/accounts';

chai.use(chaiHttp);
chai.should();

const {
  postAccount,
} = accountData;

let testAccountNumber;
const noAccountNumber = 1112223456;
const testEmail = 'alicen1995@yahoo.com';
const noEmail = 'nonexistingemail@yahoo.com';

describe('Accounts Endpoints', () => {
  describe('POST /accounts', () => {
    it('should create a new bank account', (done) => {
      chai.request(app).post('/api/v1/accounts').send(postAccount).end((err, res) => {
        testAccountNumber = res.body.data[0].accountnumber;
        res.should.have.status(201);
        res.body.should.have.property('status').eql(201);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        res.body.data[0].should.have.property('accountnumber');
        res.body.data[0].accountnumber.should.be.a('number');
        res.body.data[0].should.have.property('type');
        res.body.data[0].type.should.be.a('string');
        res.body.data[0].should.have.property('openingBalance');
        res.body.data[0].openingBalance.should.be.an('number');
        done();
      });
    });
    it('should not create a new account if account number already exists', (done) => {
      chai.request(app).post('/api/v1/accounts').send(postAccount).end((err, res) => {
        res.should.have.status(409);
        res.body.should.have.property('status').eql(409);
        res.body.should.have.property('error').eql('Account number is linked to an existing account!');
        done();
      });
    });
    it('should return 400 error if account number is empty', (done) => {
      const { accountNumber, ...partialAccountDetails } = postAccount;
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Account number is required!');
        done();
      });
    });
    it('should return 400 error if type is empty', (done) => {
      const { type, ...partialAccountDetails } = postAccount;
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Account type is required!');
        done();
      });
    });
    it('should return 400 error if openingBalance is empty', (done) => {
      const { openingBalance, ...partialAccountDetails } = postAccount;
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Opening balance is required!');
        done();
      });
    });
  });
  describe('GET /accounts/:accountNumber', () => {
    it('should get the account with the specified account number', (done) => {
      chai.request(app).get(`/api/v1/accounts/${testAccountNumber}`).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data[0].should.be.an('object');
        res.body.data[0].should.have.property('createdon');
        res.body.data[0].createdon.should.be.a('string');
        res.body.data[0].should.have.property('accountnumber');
        res.body.data[0].accountnumber.should.be.a('number');
        res.body.data[0].should.have.property('type');
        res.body.data[0].type.should.be.a('string');
        res.body.data[0].should.have.property('status');
        res.body.data[0].status.should.be.a('string');
        res.body.data[0].should.have.property('balance');
        res.body.data[0].balance.should.be.an('number');
        done();
      });
    });
    it('should return a 404 error if account number does not exist', (done) => {
      chai.request(app).get(`/api/v1/accounts/${noAccountNumber}`).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('Account with specified account number does not exist!');
        done();
      });
    });
  });
  describe('GET /accounts?status=active', () => {
    it('should get all active accounts', (done) => {
      chai.request(app).get('/api/v1/accounts?status=active').end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        res.body.data[0].should.be.an('object');
        res.body.data[0].should.have.property('createdon');
        res.body.data[0].createdon.should.be.a('string');
        res.body.data[0].should.have.property('accountnumber');
        res.body.data[0].accountnumber.should.be.a('number');
        res.body.data[0].should.have.property('type');
        res.body.data[0].type.should.be.a('string');
        res.body.data[0].should.have.property('status').eql('active');
        res.body.data[0].status.should.be.a('string');
        res.body.data[0].should.have.property('balance');
        res.body.data[0].balance.should.be.an('number');
        done();
      });
    });
  });
  describe('GET /accounts?status=dormant', () => {
    it('should get all dormant accounts', (done) => {
      chai.request(app).get('/api/v1/accounts?status=dormant').end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        res.body.data[0].should.be.an('object');
        res.body.data[0].should.have.property('createdon');
        res.body.data[0].createdon.should.be.a('string');
        res.body.data[0].should.have.property('accountnumber');
        res.body.data[0].accountnumber.should.be.a('number');
        res.body.data[0].should.have.property('type');
        res.body.data[0].type.should.be.a('string');
        res.body.data[0].should.have.property('status').eql('dormant');
        res.body.data[0].status.should.be.a('string');
        res.body.data[0].should.have.property('balance');
        res.body.data[0].balance.should.be.an('number');
        done();
      });
    });
  });
  describe('GET /accounts', () => {
    it('should get all accounts', (done) => {
      chai.request(app).get('/api/v1/accounts').end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        res.body.data[0].should.be.an('object');
        res.body.data[0].should.have.property('createdon');
        res.body.data[0].createdon.should.be.a('string');
        res.body.data[0].should.have.property('accountnumber');
        res.body.data[0].accountnumber.should.be.a('number');
        res.body.data[0].should.have.property('type');
        res.body.data[0].type.should.be.a('string');
        res.body.data[0].should.have.property('status');
        res.body.data[0].status.should.be.a('string');
        res.body.data[0].should.have.property('balance');
        res.body.data[0].balance.should.be.an('number');
        done();
      });
    });
  });
  describe('GET /users/:email/accounts', () => {
    it('should get all accounts of user with given email', (done) => {
      chai.request(app).get(`/api/v1/users/${testEmail}/accounts`).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        res.body.data[0].should.have.property('createdon');
        res.body.data[0].createdon.should.be.a('string');
        res.body.data[0].should.have.property('accountnumber');
        res.body.data[0].accountnumber.should.be.a('number');
        res.body.data[0].should.have.property('type');
        res.body.data[0].type.should.be.a('string');
        res.body.data[0].should.have.property('status');
        res.body.data[0].status.should.be.a('string');
        res.body.data[0].should.have.property('balance');
        res.body.data[0].balance.should.be.an('number');
        done();
      });
    });
    it('should return 404 error if account with given email is not found', (done) => {
      chai.request(app).get(`/api/v1/users/${noEmail}/accounts`).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('No accounts record found with the specified email!');
        done();
      });
    });
  });
  describe('PATCH /accounts/:accountNumber', () => {
    it('should update an account status', (done) => {
      chai.request(app).patch(`/api/v1/accounts/${testAccountNumber}`).send({ status: 'active' }).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('array');
        res.body.data[0].should.have.property('accountnumber');
        res.body.data[0].accountnumber.should.be.a('number');
        res.body.data[0].should.have.property('status');
        res.body.data[0].status.should.be.a('string');
        done();
      });
    });
    it('should return 404 error if account number is not found', (done) => {
      chai.request(app).patch(`/api/v1/accounts/${noAccountNumber}`).send({ status: 'active' }).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('Account with specified account number does not exist!');
        done();
      });
    });
    it('should return 404 error if account status is empty', (done) => {
      chai.request(app).patch(`/api/v1/accounts/${testAccountNumber}`).send({ status: '' }).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Account status is required!');
        done();
      });
    });
  });
  describe('DELETE /accounts/:accountNumber', () => {
    it('should delete the account with the specified account number', (done) => {
      chai.request(app).delete(`/api/v1/accounts/${testAccountNumber}`).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('message');
        res.body.message.should.be.a('string');
        done();
      });
    });
    it('should return a 404 error if account number does not exist', (done) => {
      chai.request(app).delete(`/api/v1/accounts/${noAccountNumber}`).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('Account with specified account number does not exist!');
        done();
      });
    });
  });
});
