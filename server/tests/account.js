/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import accountData from '../testData/accounts';
import signInData from '../testData/users';

chai.use(chaiHttp);
chai.should();

const {
  postAccount,
} = accountData;

let testAccountNumber;
const noAccountNumber = 1112223456;
const noEmail = 'nonexistingemail@yahoo.com';

const { client, cashier, admin } = signInData;

const { email: testEmail } = client;

let clientToken;
let cashierToken;
let adminToken;

describe('Accounts Endpoints', () => {
  describe('POST /accounts', () => {
    before('Get request tokens', async () => {
      try {
        const url = '/api/v1/auth/signin';
        const responseOne = await chai.request(app).post(url).send(client);
        clientToken = responseOne.body.data[0].token;

        const responseTwo = await chai.request(app).post(url).send(cashier);
        cashierToken = responseTwo.body.data[0].token;

        const responseThree = await chai.request(app).post(url).send(admin);
        adminToken = responseThree.body.data[0].token;
      } catch (error) {
        console.log(error);
      }
    });

    it('should create a new bank account', (done) => {
      chai.request(app).post('/api/v1/accounts').send(postAccount)
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          testAccountNumber = res.body.data[0].accountNumber;

          res.should.have.status(201);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('accountNumber');
          res.body.data[0].accountNumber.should.be.a('number');
          res.body.data[0].should.have.property('type').eql('savings');
          res.body.data[0].type.should.be.a('string');
          res.body.data[0].should.have.property('openingBalance').eql(0);
          res.body.data[0].openingBalance.should.be.an('number');
          done();
        });
    });

    it('should return 400 error if type is empty', (done) => {
      const partialAccountDetails = { type: '' };
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails)
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.type.should.eql('Account type is required!');
          done();
        });
    });

    it('should throw error if owner is null for creator not client', (done) => {
      const partialAccountDetails = { type: 'savings' };
      chai.request(app).post('/api/v1/accounts').send(partialAccountDetails)
        .set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.should.eql('Owner is required.');
          done();
        });
    });
  });

  describe('GET /accounts/:accountNumber', () => {
    it('should get the account if it belongs to the client', (done) => {
      chai.request(app).get(`/api/v1/accounts/${testAccountNumber}`)
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data[0].should.be.an('object');
          res.body.data[0].should.have.property('createdOn');
          res.body.data[0].createdOn.should.be.a('string');
          res.body.data[0].should.have.property('accountNumber')
            .eql(testAccountNumber);
          res.body.data[0].accountNumber.should.be.a('number');
          res.body.data[0].should.have.property('type').eql('savings');
          res.body.data[0].type.should.be.a('string');
          res.body.data[0].should.have.property('status').eql('active');
          res.body.data[0].status.should.be.a('string');
          res.body.data[0].should.have.property('balance').eql(0);
          res.body.data[0].balance.should.be.an('number');
          done();
        });
    });

    it('should get the account with the specified account number', (done) => {
      chai.request(app).get(`/api/v1/accounts/${testAccountNumber}`)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data[0].should.be.an('object');
          res.body.data[0].should.have.property('createdOn');
          res.body.data[0].createdOn.should.be.a('string');
          res.body.data[0].should.have.property('accountNumber')
            .eql(testAccountNumber);
          res.body.data[0].accountNumber.should.be.a('number');
          res.body.data[0].should.have.property('type').eql('savings');
          res.body.data[0].type.should.be.a('string');
          res.body.data[0].should.have.property('status').eql('active');
          res.body.data[0].status.should.be.a('string');
          res.body.data[0].should.have.property('balance').eql(0);
          res.body.data[0].balance.should.be.an('number');
          done();
        });
    });

    it('should return a 404 error if account number does not exist', (done) => {
      chai.request(app).get(`/api/v1/accounts/${noAccountNumber}`)
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have
            .property('error')
            .eql('Account with specified account number not found!');
          done();
        });
    });
  });

  describe('GET /accounts?status=active', () => {
    it('should get all active accounts', (done) => {
      chai.request(app).get('/api/v1/accounts?status=active')
        .set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(200);
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
      chai.request(app).get('/api/v1/accounts?status=dormant')
        .set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(200);
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
      chai.request(app).get('/api/v1/accounts')
        .set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(200);
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
      chai.request(app).get(`/api/v1/users/${testEmail}/accounts`)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(200);
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

    it('should return 404 error if account with email is not found', (done) => {
      chai.request(app).get(`/api/v1/users/${noEmail}/accounts`)
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error')
            .eql('No accounts record found with the specified email!');
          done();
        });
    });

    it('should return 404 error if account with email is not found', (done) => {
      chai.request(app).get(`/api/v1/users/${noEmail}/accounts`)
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error')
            .eql('No accounts record found!');
          done();
        });
    });
  });

  describe('PATCH /accounts/:accountNumber', () => {
    it('should update an account status', (done) => {
      chai.request(app).patch(`/api/v1/accounts/${testAccountNumber}`)
        .send({ status: 'active' })
        .set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('accountNumber');
          res.body.data[0].accountNumber.should.be.a('number');
          res.body.data[0].should.have.property('status').eql('active');
          res.body.data[0].status.should.be.a('string');
          done();
        });
    });

    it('should return 404 error if account number is not found', (done) => {
      chai.request(app).patch(`/api/v1/accounts/${noAccountNumber}`)
        .send({ status: 'active' }).set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error')
            .eql('Account with specified account number does not exist!');
          done();
        });
    });

    it('should return 400 error if account status is empty', (done) => {
      chai.request(app).patch(`/api/v1/accounts/${testAccountNumber}`)
        .send({ status: '' }).set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.status.should.eql('Account status is required!');
          done();
        });
    });
  });

  describe('DELETE /accounts/:accountNumber', () => {
    it('should delete the account with the account number', (done) => {
      chai.request(app).delete(`/api/v1/accounts/${testAccountNumber}`)
        .set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message');
          res.body.message.should.be.a('string');
          done();
        });
    });

    it('should return a 404 error if account number does not exist', (done) => {
      chai.request(app).delete(`/api/v1/accounts/${noAccountNumber}`)
        .set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error')
            .eql('Account with specified account number does not exist!');
          done();
        });
    });
  });
});
