/* eslint-env mocha */
import assert from 'assert';

import ArraySorter from '../helpers/ArraySorter';
import Auth from '../helpers/Auth';
import BooleanChecker from '../helpers/BooleanChecker';
import Passcode from '../helpers/Passcode';

const { arrayFinder, arrayFilter, arrayFilterNot } = ArraySorter;
const { createToken, verifyToken } = Auth;
const { isDuplicate, isExisting } = BooleanChecker;
const { encryptPassword, verifyPassword } = Passcode;

const testArray = [
  {
    propAOne: 'valueAOne',
    propATwo: 'valueATwo',
    propAThree: 'valueAThree',
  },
  {
    propBOne: 'valueBOne',
    propBTwo: 'valueBTwo',
    propBThree: 'valueBThree',
  },
  {
    propCOne: 'valueAOne',
    propCTwo: 'valueCTwo',
    propCThree: 'valueCThree',
  },
  {
    propDOne: 'valueDOne',
    propDTwo: 'valueDTwo',
    propDThree: 'valueDThree',
  },
];

const truthyArray = ['true', true, { true: true, trueToo: 'trueToo' }, 1];

const falsyArray = [false, undefined, null, 0, ''];

describe('ArraySorter', () => {
  describe('arrayFinder()', () => {
    it('should return a value if it exists in array', () => {
      assert.equal(testArray[0], arrayFinder(testArray, 'propAOne', 'valueAOne'));
      assert.equal(testArray[1], arrayFinder(testArray, 'propBThree', 'valueBThree'));
    });
    it('should return undefined if value does not exist in array', () => {
      assert.equal(undefined, arrayFinder(testArray, 'propAOne', 'notValueAOne'));
      assert.equal(undefined, arrayFinder(testArray, 'propBThree', 'notValueBThree'));
    });
  });

  describe('arrayFilter()', () => {
    it('should return an array if the filter value exists', () => {
      const result = arrayFilter(testArray, 'propAOne', 'valueAOne');
      assert.equal(true, Array.isArray(result));
    });
    it('should return empty array if value does not exist in array', () => {
      const result = arrayFilter(testArray, 'propAOne', 'notValueAOne');
      assert.equal(true, !result.length);
    });
  });

  describe('arrayFilterNot()', () => {
    it('should return an array excluding the filter value', () => {
      const result = arrayFilterNot(testArray, 'propAOne', 'valueAOne');
      assert.equal(true, Array.isArray(result));
      assert.equal(undefined, arrayFinder(result, 'propAOne', 'valueAOne'));
    });
  });
});

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

describe('BooleanChecker', () => {
  describe('isDuplicate()', () => {
    it('should return false if value is truthy', () => {
      assert.equal(false, isDuplicate(truthyArray[0]));
      assert.equal(false, isDuplicate(truthyArray[1]));
      assert.equal(false, isDuplicate(truthyArray[2]));
      assert.equal(false, isDuplicate(truthyArray[3]));
    });
    it('should return true if value is falsy', () => {
      assert.equal(true, isDuplicate(falsyArray[0]));
      assert.equal(true, isDuplicate(falsyArray[1]));
      assert.equal(true, isDuplicate(falsyArray[2]));
      assert.equal(true, isDuplicate(falsyArray[3]));
      assert.equal(true, isDuplicate(falsyArray[4]));
    });
  });
  describe('isExisting()', () => {
    it('should return true if value is truthy', () => {
      assert.equal(true, isExisting(truthyArray[0]));
      assert.equal(true, isExisting(truthyArray[1]));
      assert.equal(true, isExisting(truthyArray[2]));
      assert.equal(true, isExisting(truthyArray[3]));
    });
    it('should return false if value is falsy', () => {
      assert.equal(false, isExisting(falsyArray[0]));
      assert.equal(false, isExisting(falsyArray[1]));
      assert.equal(false, isExisting(falsyArray[2]));
      assert.equal(false, isExisting(falsyArray[3]));
      assert.equal(false, isExisting(falsyArray[4]));
    });
  });
});

describe('Passcode', () => {
  describe('encryptPassword()', () => {
    it('should create a hash', async () => {
      const password = 'unecryptedpassword';
      const hashedPassword = await encryptPassword(password);
      const hashRegex = /^\$2[ayb]\$.{56}$/;
      assert.equal(true, hashRegex.test(hashedPassword));
      assert.equal(60, hashedPassword.length);
    });
  });
  describe('verifyPassword()', () => {
    it('should verify password', async () => {
      const password = 'notSecurePassword';
      const hashedPassword = await encryptPassword(password);
      const isVerified = await verifyPassword(password, hashedPassword);
      assert.equal(true, isVerified);
    });
  });
});
