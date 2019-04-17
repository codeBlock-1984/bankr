import Passcode from '../../helpers/Passcode';
import pool from '../db';

(async function seedDb() {
  const { encryptPassword } = Passcode;
  const clientOnePassword = await encryptPassword('securepassword');
  const clientTwoPassword = await encryptPassword('verysecurepassword');
  const cashierPassword = await encryptPassword('strongandsecurepassword');

  const client1 = `INSERT INTO users(firstName, lastName, email, password, type, isAdmin)
                  VALUES('Alice', 'Nwankwo', 'alicen1995@yahoo.com', '${clientOnePassword}', 'client', false)`;

  const client2 = `INSERT INTO users(firstName, lastName, email, password, type, isAdmin)
                  VALUES('Leonard', 'Mustapha', 'leomustapha@yahoo.com', '${clientTwoPassword}', 'client', false)`;

  const cashier = `INSERT INTO users(firstName, lastName, email, password, type, isAdmin)
                  VALUES('Cyril', 'Umar', 'cyrilu@gmail.com', '${cashierPassword}', 'staff', true)`;

  const account1 = `INSERT INTO accounts(accountNumber, firstName, lastName, email, owner, type, status, balance)
                    VALUES(1012934423, 'Alice', 'Nwankwo', 'alicen1995@yahoo.com', 1, 'savings', 'active', 5000.05)`;

  const account2 = `INSERT INTO accounts(accountNumber, firstName, lastName, email, owner, type, status, balance)
                    VALUES(1020095776, 'Leonard', 'Mustapha', 'leomustapha@yahoo.com', 2, 'current', 'dormant', 1345.65)`;

  const account3 = `INSERT INTO accounts(accountNumber, firstName, lastName, email, owner, type, status, balance)
                    VALUES(1022900469, 'Alice', 'Nwankwo', 'alicen1995@yahoo.com', 1, 'current', 'active', 56000.10)`;

  const account4 = `INSERT INTO accounts(accountNumber, firstName, lastName, email, owner, type, status, balance)
                    VALUES(1015779306, 'Leonard', 'Mustapha', 'leomustapha@yahoo.com', 2, 'savings', 'dormant', 9000.83)`;

  const transaction1 = `INSERT INTO transactions(type, accountNumber, account, owner, cashier, amount, oldBalance, newBalance)
                      VALUES('credit', 1012934423, 1, 1, 3, 300.32, 5000.05, 5300.38)`;
  const transaction2 = `INSERT INTO transactions(type, accountNumber, account, owner, cashier, amount, oldBalance, newBalance)
                      VALUES('debit', 1022900469, 2, 1, 3, 1200.04, 5300.38, 4100.34)`;
  const transaction3 = `INSERT INTO transactions(type, accountNumber, account, owner, cashier, amount, oldBalance, newBalance)
                      VALUES('credit', 1020095776, 3, 2, 3, 50.25, 1345.65, 1395.90)`;
  const transaction4 = `INSERT INTO transactions(type, accountNumber, account, owner, cashier, amount, oldBalance, newBalance)
                      VALUES('debit', 1015779306, 4, 2, 3, 250.76, 9000.83, 8750.07)`;

  const client = await pool.connect();
  try {
    await client.query(client1);
    await client.query(client2);
    await client.query(cashier);
    await client.query(account1);
    await client.query(account2);
    await client.query(account3);
    await client.query(account4);
    await client.query(transaction1);
    await client.query(transaction2);
    await client.query(transaction3);
    await client.query(transaction4);
  } catch (error) {
    console.log(error);
  } finally {
    await client.release();
  }
}());
