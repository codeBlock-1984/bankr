import debug from 'debug';

import Passcode from '../../helpers/Passcode';
import pool from '../db';

const debugg = debug('Migrate undo');

(async function seedDb() {
  const { encryptPassword } = Passcode;
  const clientOnePassword = await encryptPassword('securepassword');
  const clientTwoPassword = await encryptPassword('verysecurepassword');
  const cashierOnePassword = await encryptPassword('strongandsecurepassword');
  const cashierTwoPassword = await encryptPassword('verystrongandsecurepassword');

  const clientOne = `INSERT INTO users(firstName, lastName, email, password, type, isAdmin)
                     VALUES('Alice', 'Nwankwo', 'alicen1995@yahoo.com', '${clientOnePassword}', 'client', false)`;

  const clientTwo = `INSERT INTO users(firstName, lastName, email, password, type, isAdmin)
                     VALUES('Leonard', 'Mustapha', 'leomustapha@yahoo.com', '${clientTwoPassword}', 'client', false)`;

  const cashierOne = `INSERT INTO users(firstName, lastName, email, password, type, isAdmin)
                      VALUES('Cyril', 'Umar', 'cyrilu@gmail.com', '${cashierOnePassword}', 'staff', true)`;

  const cashierTwo = `INSERT INTO users(firstName, lastName, email, password, type, isAdmin)
                      VALUES('Michael', 'Bankole', 'mikebanks@live.com', '${cashierTwoPassword}', 'staff', true)`;

  const accountOne = `INSERT INTO accounts(accountNumber, owner, type, status, balance)
                      VALUES(1012934423, 1, 'savings', 'active', 5000.05)`;

  const accountTwo = `INSERT INTO accounts(accountNumber, owner, type, status, balance)
                      VALUES(1020095776, 2, 'current', 'dormant', 1345.65)`;

  const accountThree = `INSERT INTO accounts(accountNumber, owner, type, status, balance)
                        VALUES(1022900469, 1, 'current', 'active', 56000.10)`;

  const accountFour = `INSERT INTO accounts(accountNumber, owner, type, status, balance)
                       VALUES(1015779306, 2, 'savings', 'dormant', 9000.83)`;

  const transactionOne = `INSERT INTO transactions(type, accountNumber, account, cashier, amount, oldBalance, newBalance)
                          VALUES('credit', 1012934423, 1, 3, 300.32, 5000.05, 5300.38)`;
  const transactionTwo = `INSERT INTO transactions(type, accountNumber, account, cashier, amount, oldBalance, newBalance)
                          VALUES('debit', 1022900469, 3, 3, 1200.04, 5300.38, 4100.34)`;
  const transactionThree = `INSERT INTO transactions(type, accountNumber, account, cashier, amount, oldBalance, newBalance)
                            VALUES('credit', 1020095776, 2, 3, 50.25, 1345.65, 1395.90)`;
  const transactionFour = `INSERT INTO transactions(type, accountNumber, account, cashier, amount, oldBalance, newBalance)
                           VALUES('debit', 1020095776, 2, 3, 250.76, 9000.83, 8750.07)`;

  const client = await pool.connect();
  try {
    await client.query(clientOne);
    await client.query(clientTwo);
    await client.query(cashierOne);
    await client.query(cashierTwo);
    await client.query(accountOne);
    await client.query(accountTwo);
    await client.query(accountThree);
    await client.query(accountFour);
    await client.query(transactionOne);
    await client.query(transactionTwo);
    await client.query(transactionThree);
    await client.query(transactionFour);
  } catch (error) {
    debugg(error);
  } finally {
    await client.release();
  }
}());
