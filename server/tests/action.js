/* eslint-env mocha */
import chai from 'chai';
import chaiHttp from 'chai-http';

import app from '../index';
import signInData from '../testData/users';

chai.use(chaiHttp);
chai.should();

const { admin, adminTwo } = signInData;
let adminToken;
let adminTwoToken;

describe('Actions Endpoints', () => {
  describe('GET /actions', () => {
    before('Get request token', async () => {
      try {
        const url = '/api/v1/auth/signin';

        const responseOne = await chai.request(app).post(url).send(admin);
        adminToken = responseOne.body.data[0].token;

        const responseTwo = await chai.request(app).post(url).send(adminTwo);
        adminTwoToken = responseTwo.body.data[0].token;
      } catch (error) {
        console.log(error);
      }
    });

    it('should get the actions of the specified admin', (done) => {
      chai.request(app).get('/api/v1/actions')
        .set('x-auth-token', adminToken)
        .end((err, res) => {
          const actionEmail = 'wendyo@gmail.com';

          res.should.have.status(200);
          res.body.should.have.property('data');
          res.body.data.should.be.an('array');
          res.body.data[0].should.have.property('firstname').eql('Wendy');
          res.body.data[0].firstname.should.be.a('string');
          res.body.data[0].should.have.property('lastname').eql('Okechukwu');
          res.body.data[0].lastname.should.be.an('string');
          res.body.data[0].should.have.property('role').eql('cashier');
          res.body.data[0].role.should.be.an('string');
          res.body.data[0].should.have.property('type').eql('created user');
          res.body.data[0].type.should.be.an('string');
          res.body.data[0].should.have.property('email').eql(actionEmail);
          res.body.data[0].email.should.be.an('string');
          res.body.data[0].should.have.property('admin').eql(8);
          res.body.data[0].admin.should.be.an('number');
          done();
        });
    });

    it('should return a 404 error if admin does not have actions', (done) => {
      chai.request(app).get(`/api/v1/actions`)
        .set('x-auth-token', adminTwoToken)
        .end((err, res) => {
          res.should.have.status(404);
          res.body.should.have
            .property('error')
            .eql('No action records found for admin with id 9!');
          done();
        });
    });
  });
});
