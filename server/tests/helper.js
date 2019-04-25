/* eslint-env mocha */
import assert from 'assert';

import Auth from '../helpers/Auth';
import PasswordAuth from '../helpers/PasswordAuth';

const { createToken, verifyToken } = Auth;
const { encryptPassword, verifyPassword } = PasswordAuth;


describe('Auth', () => {
  let token;
  const payload = { id: 1, type: 'client' };
  describe('createToken()', () => {
    it('should create a token', () => {
      token = createToken(payload);
      assert.equal('string', typeof token);
    });
  });

  describe('verifyToken()', () => {
    it('should verify a token', () => {
      const result = verifyToken(token);
      const resultProps = Object.keys(result);
      const resultValues = Object.values(result);
      const payloadProps = Object.keys(payload);
      const payloadValues = Object.values(payload);
      const isEqualProps = payloadProps.every((prop) => {
        return resultProps.includes(prop);
      });
      const isEqualValues = payloadValues.every((value) => {
        return resultValues.includes(value);
      });
      assert.equal(true, isEqualProps);
      assert.equal(true, isEqualValues);
    });
  });
});


describe('PasswordAuth', () => {
  describe('encryptPassword()', () => {
    it('should create a hash', async () => {
      try {
        const password = 'unecryptedpassword';
        const hashedPassword = await encryptPassword(password);
        const hashRegex = /^\$2[ayb]\$.{56}$/;
        assert.equal(true, hashRegex.test(hashedPassword));
        assert.equal(60, hashedPassword.length);
      } catch (error) {
        console.log(error);
      }
    });
  });
  describe('verifyPassword()', () => {
    it('should verify password', async () => {
      try {
        const password = 'notSecurePassword';
        const hashedPassword = await encryptPassword(password);
        const isVerified = await verifyPassword(password, hashedPassword);
        assert.equal(true, isVerified);
      } catch (error) {
        console.log(error);
      }
    });
  });
});
