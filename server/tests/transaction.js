/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';
import chaiDatetime from 'chai-datetime';

import app from '../index';
import transactionData from '../testData/transactions';
import signInData from '../testData/users';

chai.use(chaiHttp);
chai.use(chaiDatetime);
chai.should();

const { testTransactionData } = transactionData;
const { amount: testAmount } = testTransactionData;

const { client, clientTwo, cashier: cashierUser } = signInData;

let clientToken;
let cashierToken;
let clientTwoToken;

const testAccountNumber = 1012934423;
let testTransactionId;
const noTransactionId = 1009;
const noAccountNumber = 1050003948;
const noTransactionsAccountNumber = 1015779306;

describe('Transactions Endpoints', () => {
  before('Get request tokens', async () => {
    try {
      const url = '/api/v1/auth/signin';
      const responseOne = await chai.request(app).post(url).send(client);
      clientToken = responseOne.body.data[0].token;

      const responseTwo = await chai.request(app).post(url).send(clientTwo);
      clientTwoToken = responseTwo.body.data[0].token;

      const responseThree = await chai.request(app).post(url).send(cashierUser);
      cashierToken = responseThree.body.data[0].token;
    } catch (error) {
      console.log(error);
    }
  });

  describe('POST /transactions/:accountNumber/credit', () => {
    it('should credit a bank account', (done) => {
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/credit`)
        .set('x-auth-token', cashierToken)
        .send(testTransactionData)
        .end((err, res) => {
          testTransactionId = res.body.data[0].transactionId;
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('transactionId');
          res.body.data[0].transactionId.should.be.a('number');
          res.body.data[0].should.have.property('accountNumber')
            .eql(testAccountNumber);
          res.body.data[0].accountNumber.should.be.a('number');
          res.body.data[0].should.have.property('amount').eql(testAmount);
          res.body.data[0].amount.should.be.a('number');
          res.body.data[0].should.have.property('cashier').eql(3);
          res.body.data[0].cashier.should.be.a('number');
          res.body.data[0].should.have.property('transactionType')
            .eql('credit');
          res.body.data[0].transactionType.should.be.a('string');
          res.body.data[0].should.have.property('accountBalance');
          res.body.data[0].accountBalance.should.be.a('number');
          done();
        });
    });


    it('should return 400 error if amount is empty', (done) => {
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/credit`)
        .send({ }).set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.amount.should.eql('Amount is required.');
          done();
        });
    });
  });

  describe('POST /transactions/:accountNumber/debit', () => {
    it('should debit a bank account', (done) => {
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/debit`)
        .send(testTransactionData).set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('transactionId');
          res.body.data[0].transactionId.should.be.a('number');
          res.body.data[0].should.have.property('accountNumber')
            .eql(testAccountNumber);
          res.body.data[0].accountNumber.should.be.a('number');
          res.body.data[0].should.have.property('amount').eql(testAmount);
          res.body.data[0].amount.should.be.a('number');
          res.body.data[0].should.have.property('cashier').eql(3);
          res.body.data[0].cashier.should.be.a('number');
          res.body.data[0].should.have.property('transactionType').eql('debit');
          res.body.data[0].transactionType.should.be.a('string');
          res.body.data[0].should.have.property('accountBalance');
          res.body.data[0].accountBalance.should.be.a('number');
          done();
        });
    });

    it('should return 400 error if amount is empty', (done) => {
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/debit`)
        .send({ }).set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('error');
          res.body.error.amount.should.eql('Amount is required.');
          done();
        });
    });
  });

  describe('GET /transactions/:transactionId', () => {
    it('should get the transaction with the specified id', (done) => {
      chai.request(app).get(`/api/v1/transactions/${testTransactionId}`)
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('transactionId')
            .eql(testTransactionId);
          res.body.data[0].transactionId.should.be.a('number');
          res.body.data[0].should.have.property('createdOn');
          res.body.data[0].createdOn.should.be.a('string');
          res.body.data[0].should.have.property('type').eql('credit');
          res.body.data[0].type.should.be.a('string');
          res.body.data[0].should.have.property('accountNumber')
            .eql(testAccountNumber);
          res.body.data[0].accountNumber.should.be.a('number');
          res.body.data[0].should.have.property('amount').eql(testAmount);
          res.body.data[0].amount.should.be.a('number');
          res.body.data[0].should.have.property('oldBalance');
          res.body.data[0].oldBalance.should.be.a('number');
          res.body.data[0].should.have.property('newBalance');
          res.body.data[0].newBalance.should.be.a('number');
          done();
        });
    });

    it('should return a 404 error if transaction id does not exist', (done) => {
      chai.request(app).get(`/api/v1/transactions/${noTransactionId}`)
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error')
            .eql('Transaction with specified id does not exist!');
          done();
        });
    });
  });

  describe('GET /accounts/:accountNumber/transactions', () => {
    it('should get all transactions with the account number', (done) => {
      chai.request(app)
        .get(`/api/v1/accounts/${testAccountNumber}/transactions`)
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('transactionid');
          res.body.data[0].transactionid.should.be.a('number');
          res.body.data[0].should.have.property('createdon');
          res.body.data[0].createdon.should.be.a('string');
          res.body.data[0].should.have.property('type');
          res.body.data[0].type.should.be.a('string');
          res.body.data[0].should.have.property('accountnumber')
            .eql(testAccountNumber);
          res.body.data[0].accountnumber.should.be.a('number');
          res.body.data[0].should.have.property('amount');
          res.body.data[0].amount.should.be.a('number');
          res.body.data[0].should.have.property('oldbalance');
          res.body.data[0].oldbalance.should.be.a('number');
          res.body.data[0].should.have.property('newbalance');
          res.body.data[0].newbalance.should.be.a('number');
          done();
        });
    });

    it('should return 404 error if account does not exist', (done) => {
      chai.request(app).get(`/api/v1/accounts/${noAccountNumber}/transactions`)
        .set('x-auth-token', clientToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error')
            .eql('No user account with the given account number!');
          done();
        });
    });

    it('should return 404 if no transactions exist for the account', (done) => {
      chai.request(app)
        .get(`/api/v1/accounts/${noTransactionsAccountNumber}/transactions`)
        .set('x-auth-token', clientTwoToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have.property('error')
            .eql('No transactions record found for the account!');
          done();
        });
    });
  });

  describe('GET /transactions', () => {
    it('should get all transactions', (done) => {
      chai.request(app).get('/api/v1/transactions')
        .set('x-auth-token', cashierToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('data');
          done();
        });
    });
  });
});
