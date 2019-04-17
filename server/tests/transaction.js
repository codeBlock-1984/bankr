/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import transactionData from '../testData/transactions';
import accountData from '../testData/accounts';

chai.use(chaiHttp);
chai.should();

const {
  testCreditTransactionData,
  testDebitTransactionData,
  testDummyTransactionData,
} = transactionData;

const { testTransactionAccountData } = accountData;
let testAccountNumber;
let testTransactionId;
const noTransactionId = 1009;

describe('Transactions Endpoints', () => {
  before('seed accounts dummy data', async () => {
    const response = await chai.request(app).post('/api/v1/accounts').send(testTransactionAccountData);
    testAccountNumber = response.body.data.accountNumber;
  });
  describe('POST /transactions/:accountNumber/credit', () => {
    it('should credit a bank account', (done) => {
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/credit`).send(testCreditTransactionData).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('id');
        res.body.data.id.should.be.a('number');
        res.body.data.should.have.property('accountNumber');
        res.body.data.accountNumber.should.be.a('number');
        res.body.data.should.have.property('amount');
        res.body.data.amount.should.be.a('number');
        res.body.data.should.have.property('cashier');
        res.body.data.cashier.should.be.a('number');
        res.body.data.should.have.property('type');
        res.body.data.type.should.be.a('string');
        res.body.data.should.have.property('accountBalance');
        res.body.data.accountBalance.should.be.a('number');
        done();
      });
    });
    it('should return 400 error if account number is empty', (done) => {
      const { accountNumber, ...partialTransactionDetails } = testCreditTransactionData;
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/credit`).send(partialTransactionDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Account number is required!');
        done();
      });
    });
    it('should return 400 error if transaction type is empty', (done) => {
      const { type, ...partialTransactionDetails } = testCreditTransactionData;
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/credit`).send(partialTransactionDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Transaction type is required!');
        done();
      });
    });
    it('should return 400 error if cashier is empty', (done) => {
      const { cashier, ...partialTransactionDetails } = testCreditTransactionData;
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/credit`).send(partialTransactionDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Cashier is required!');
        done();
      });
    });
    it('should return 400 error if amount is empty', (done) => {
      const { amount, ...partialTransactionDetails } = testCreditTransactionData;
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/credit`).send(partialTransactionDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Amount is required!');
        done();
      });
    });
  });

  describe('POST /transactions/:accountNumber/debit', () => {
    it('should credit a bank account', (done) => {
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/debit`).send(testDebitTransactionData).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        res.body.data.should.have.property('id');
        res.body.data.id.should.be.a('number');
        res.body.data.should.have.property('accountNumber');
        res.body.data.accountNumber.should.be.a('number');
        res.body.data.should.have.property('amount');
        res.body.data.amount.should.be.a('number');
        res.body.data.should.have.property('cashier');
        res.body.data.cashier.should.be.a('number');
        res.body.data.should.have.property('type');
        res.body.data.type.should.be.a('string');
        res.body.data.should.have.property('accountBalance');
        res.body.data.accountBalance.should.be.a('number');
        done();
      });
    });
    it('should return 400 error if account number is empty', (done) => {
      const { accountNumber, ...partialTransactionDetails } = testDebitTransactionData;
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/debit`).send(partialTransactionDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Account number is required!');
        done();
      });
    });
    it('should return 400 error if transaction type is empty', (done) => {
      const { type, ...partialTransactionDetails } = testDebitTransactionData;
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/debit`).send(partialTransactionDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Transaction type is required!');
        done();
      });
    });
    it('should return 400 error if cashier is empty', (done) => {
      const { cashier, ...partialTransactionDetails } = testDebitTransactionData;
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/debit`).send(partialTransactionDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Cashier is required!');
        done();
      });
    });
    it('should return 400 error if amount is empty', (done) => {
      const { amount, ...partialTransactionDetails } = testDebitTransactionData;
      chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/debit`).send(partialTransactionDetails).end((err, res) => {
        res.should.have.status(400);
        res.body.should.have.property('status').eql(400);
        res.body.should.have.property('error').eql('Amount is required!');
        done();
      });
    });
  });

  describe('GET /transactions/:transactionId', () => {
    before('seed transactions dummy data', async () => {
      const response = await chai.request(app).post(`/api/v1/transactions/${testAccountNumber}/credit`).send(testDummyTransactionData);
      testTransactionId = response.body.data.id;
    });
    it('should get the transaction with the specified id', (done) => {
      chai.request(app).get(`/api/v1/transactions/${testTransactionId}`).end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        res.body.data.should.be.an('object');
        done();
      });
    });
    it('should return a 404 error if transaction id does not exist', (done) => {
      chai.request(app).get(`/api/v1/transactions/${noTransactionId}`).end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('status').eql(404);
        res.body.should.have.property('error').eql('Transaction with specified id does not exist!');
        done();
      });
    });
  });
  describe('GET /transactions', () => {
    it('should get all transactions', (done) => {
      chai.request(app).get('/api/v1/transactions').end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('status').eql(200);
        res.body.should.have.property('data');
        done();
      });
    });
  });
});
