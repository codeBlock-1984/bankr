/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';

chai.use(chaiHttp);
chai.should();

const testAccount = {
  accountNumber: 1012579609,
  owner: 1,
  firstName: 'Alice',
  lastName: 'Nwankwo',
  email: 'alicen1995@yahoo.com',
  type: 'savings',
  openingBalance: 120350.05,
  status: 'active',
};
const testAccountData = {
  accountNumber: 1025729475,
  owner: 1,
  firstName: 'Alice',
  lastName: 'Nwankwo',
  email: 'alicen1995@yahoo.com',
  type: 'current',
  openingBalance: 45000.35,
  status: 'dormant',
};
const delTestAccountData = {
  accountNumber: 1024545001,
  owner: 1,
  firstName: 'Alice',
  lastName: 'Nwankwo',
  email: 'alicen1995@yahoo.com',
  type: 'current',
  openingBalance: 45000.35,
  status: 'dormant',
};
const getTestAccountData = {
  accountNumber: 1025887203,
  owner: 1,
  firstName: 'Alice',
  lastName: 'Nwankwo',
  email: 'alicen1995@yahoo.com',
  type: 'current',
  openingBalance: 45000.35,
  status: 'dormant',
};
let testAccountNumber;
let delTestAccountNumber;
let getTestAccountNumber;
const noAccountNumber = 1112223456;
// const testStatus = 'active';

/* eslint-disable no-unused-vars */

describe('Accounts Endpoints', () => {
  describe('POST /accounts', () => {
    it('should create a new bank account', (done) => {
      chai.request(app).post('/api/v1/accounts').send(testAccount).end((err, res) => {
        res.should.have.status(201);
        res.body.should.have.property('status').eql(201);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('accountNumber');
        res.body.data.accountNumber.should.be.a('number');
        res.body.data.should.have.property('firstName');
        res.body.data.firstName.should.be.a('string');
        res.body.data.should.have.property('lastName');
        res.body.data.lastName.should.be.a('string');
        res.body.data.should.have.property('email');
        res.body.data.email.should.be.a('string');
        res.body.data.should.have.property('type');
        res.body.data.type.should.be.a('string');
        res.body.data.should.have.property('openingBalance');
        res.body.data.openingBalance.should.be.an('number');
        done();
      });
    });
    it('should return 400 error if account number is empty', (done) => {
      const { accountNumber, ...partialAccountDetails } = testAccount;
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Account number is required!');
        done();
      });
    });
    it('should return 400 error if first name is empty', (done) => {
      const { firstName, ...partialAccountDetails } = testAccount;
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Firstname is required!');
        done();
      });
    });
    it('should return 400 error if last name is empty', (done) => {
      const { lastName, ...partialAccountDetails } = testAccount;
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Lastname is required!');
        done();
      });
    });
    it('should return 400 error if email is empty', (done) => {
      const { email, ...partialAccountDetails } = testAccount;
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Email is required!');
        done();
      });
    });
    it('should return 400 error if type is empty', (done) => {
      const { type, ...partialAccountDetails } = testAccount;
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Account type is required!');
        done();
      });
    });
    it('should return 400 error if openingBalance is empty', (done) => {
      const { openingBalance, ...partialAccountDetails } = testAccount;
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Opening balance is required!');
        done();
      });
    });
  });
  describe('PATCH /accounts/:accountNumber', () => {
    before('seed accounts dummy data', async () => {
      const response = await chai.request(app).post('/api/v1/accounts').send(testAccountData);
      testAccountNumber = response.body.data.accountNumber;
    });
    it('should update an account status', (done) => {
      chai.request(app).patch(`/api/v1/accounts/${testAccountNumber}`).send({ status: 'active' }).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('accountNumber');
        res.body.data.accountNumber.should.be.a('number');
        res.body.data.should.have.property('status');
        res.body.data.status.should.be.a('string');
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
    before('seed accounts dummy data for delete', async () => {
      const response = await chai.request(app).post('/api/v1/accounts').send(delTestAccountData);
      delTestAccountNumber = response.body.data.accountNumber;
    });
    it('should delete the account with the specified account number', (done) => {
      chai.request(app).delete(`/api/v1/accounts/${delTestAccountNumber}`).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
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
  describe('GET /accounts/:accountNumber', () => {
    before('seed accounts dummy data', async () => {
      const response = await chai.request(app).post('/api/v1/accounts').send(getTestAccountData);
      getTestAccountNumber = response.body.data.accountNumber;
    });
    it('should get the account with the specified account number', (done) => {
      chai.request(app).get(`/api/v1/accounts/${getTestAccountNumber}`).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
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
  describe('GET /accounts', () => {
    it('should get all accounts', (done) => {
      chai.request(app).get('/api/v1/accounts').end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        done();
      });
    });
  });
});
