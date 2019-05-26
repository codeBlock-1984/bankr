import debug from 'debug';

import PasswordAuth from '../../helpers/PasswordAuth';
import pool from '../db';

const debugg = debug('Seeding database');

(async function seedDb() {
  const { encryptPassword } = PasswordAuth;
  const clientOnePassword = await encryptPassword('securepassword1');
  const clientTwoPassword = await encryptPassword('securepassword2');
  const cashierOnePassword = await encryptPassword('strongpassword1');
  const cashierTwoPassword = await encryptPassword('strongpassword2');
  const cashierThreePassword = await encryptPassword('strongpassword3');
  const cashierFourPassword = await encryptPassword('strongpassword4');
  const adminOnePassword = await encryptPassword('adminpassword1');
  const adminTwoPassword = await encryptPassword('adminpassword2');
  const adminThreePassword = await encryptPassword('adminpassword3');
  const adminFourPassword = await encryptPassword('adminpassword4');

  const clientOne = `INSERT INTO users
                     (firstName, lastName, email, password, type, isAdmin)
                     VALUES('Alice', 'Nwankwo', 'emmanuelroic@gmail.com',
                     '${clientOnePassword}', 'client', false)`;

  const clientTwo = `INSERT INTO users
                     (firstName, lastName, email, password, type, isAdmin)
                     VALUES('Leonard', 'Mustapha', 'leomustapha@yahoo.com',
                     '${clientTwoPassword}', 'client', false)`;

  const cashierOne = `INSERT INTO users
                      (firstName, lastName, email, password, type, isAdmin)
                      VALUES('Cyril', 'Umar', 'cyrilu@gmail.com',
                      '${cashierOnePassword}', 'cashier', true)`;

  const cashierTwo = `INSERT INTO users
                      (firstName, lastName, email, password, type, isAdmin)
                      VALUES('Michael', 'Bankole', 'mikebanks@live.com',
                      '${cashierTwoPassword}', 'cashier', true)`;

  const cashierThree = `INSERT INTO users
                      (firstName, lastName, email, password, type, isAdmin)
                      VALUES('Sophie', 'Nwogu', 'sophie@yahoo.com',
                      '${cashierThreePassword}', 'cashier', true)`;

  const cashierFour = `INSERT INTO users
                      (firstName, lastName, email, password, type, isAdmin)
                      VALUES('Wendy', 'Okechukwu', 'wendyo@gmail.com',
                      '${cashierFourPassword}', 'cashier', true)`;

  const adminOne = `INSERT INTO users
                    (firstName, lastName, email, password, type, isAdmin)
                    VALUES('Jessica', 'Chastain', 'misssloane@live.com',
                    '${adminOnePassword}', 'admin', true)`;

  const adminTwo = `INSERT INTO users
                    (firstName, lastName, email, password, type, isAdmin)
                    VALUES('Christian', 'Bale', 'darknight@live.com',
                    '${adminTwoPassword}', 'admin', true)`;

  const adminThree = `INSERT INTO users
                    (firstName, lastName, email, password, type, isAdmin)
                    VALUES('Kaley', 'Cuoco', 'bigbang@live.com',
                    '${adminThreePassword}', 'admin', true)`;

  const adminFour = `INSERT INTO users
                    (firstName, lastName, email, password, type, isAdmin)
                    VALUES('Tom', 'Hardy', 'madmax@live.com',
                    '${adminFourPassword}', 'admin', true)`;

  const accountOne = `INSERT INTO accounts
                      (accountNumber, owner, type, status, balance)
                      VALUES(1012934423, 1, 'savings', 'active', 5000.05)`;

  const accountTwo = `INSERT INTO accounts
                      (accountNumber, owner, type, status, balance)
                      VALUES(1020095776, 2, 'current', 'dormant', 1345.65)`;

  const accountThree = `INSERT INTO accounts
                        (accountNumber, owner, type, status, balance)
                        VALUES(1022900469, 1, 'current', 'active', 56000.10)`;

  const accountFour = `INSERT INTO accounts
                       (accountNumber, owner, type, status, balance)
                       VALUES(1015779306, 2, 'savings', 'dormant', 9000.83)`;

  const transactionOne = `INSERT INTO transactions
                          (type, accountNumber, account, cashier,
                          amount, oldBalance, newBalance)
                          VALUES('credit', 1012934423, 1, 3,
                          300.32, 5000.05, 5300.38)`;

  const transactionTwo = `INSERT INTO transactions
                          (type, accountNumber, account, cashier,
                          amount, oldBalance, newBalance)
                          VALUES('debit', 1022900469, 3, 3,
                          1200.04, 5300.38, 4100.34)`;

  const transactionThree = `INSERT INTO transactions
                           (type, accountNumber, account, cashier, 
                           amount, oldBalance, newBalance)
                           VALUES('credit', 1020095776, 2, 3,
                           50.25, 1345.65, 1395.90)`;

  const transactionFour = `INSERT INTO transactions
                           (type, accountNumber, account, cashier, amount,
                           oldBalance, newBalance)
                           VALUES('debit', 1020095776, 2, 3,
                           250.76, 9000.83, 8750.07)`;

  const actionOne = `INSERT INTO actions
                     (firstName, lastName, role, type, email, admin)
                     VALUES('Sophie', 'Nwogu', 'cashier',
                     'created user', 'sophie@yahoo.com', 7)`;

  const actionTwo = `INSERT INTO actions
                     (firstName, lastName, role, type, email, admin)
                     VALUES('Wendy', 'Okechukwu', 'cashier',
                     'created user', 'wendyo@gmail.com', 8)`;

  const actionThree = `INSERT INTO actions
                       (firstName, lastName, role, type, email, admin)
                       VALUES('Kaley', 'Cuoco', 'admin',
                       'created user', 'bigbang@live.com', 7)`;

  const actionFour = `INSERT INTO actions
                      (firstName, lastName, role, type, email, admin)
                      VALUES('Tom', 'Hardy', 'admin',
                      'created user', 'madmax@live.com', 8)`;

  const client = await pool.connect();
  try {
    await client.query(clientOne);
    await client.query(clientTwo);
    await client.query(cashierOne);
    await client.query(cashierTwo);
    await client.query(cashierThree);
    await client.query(cashierFour);
    await client.query(adminOne);
    await client.query(adminTwo);
    await client.query(adminThree);
    await client.query(adminFour);
    await client.query(accountOne);
    await client.query(accountTwo);
    await client.query(accountThree);
    await client.query(accountFour);
    await client.query(transactionOne);
    await client.query(transactionTwo);
    await client.query(transactionThree);
    await client.query(transactionFour);
    await client.query(actionOne);
    await client.query(actionTwo);
    await client.query(actionThree);
    await client.query(actionFour);
  } catch (error) {
    debugg(error);
  } finally {
    await client.release();
  }
}());
