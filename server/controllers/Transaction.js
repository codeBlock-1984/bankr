import pool from '../database/db';
import Mailer from '../helpers/Mailer';

const { send } = Mailer;

class TransactionController {
  static async creditTransaction(req, res) {
    const client = await pool.connect();
    try {
      const {
        amount: transactionAmount,
        cashier: transactionCashier,
        type: inputTransactionType,
      } = req.body;
      const { accountNumber: accountNumberParam } = req.params;
      const findAccountQuery = `SELECT  email, firstName, balance, lastName from users
                                INNER JOIN accounts ON users.id = accounts.owner WHERE accountNumber = $1`;
      const findValues = [accountNumberParam];
      const { rows } = await client.query(findAccountQuery, findValues);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Account with given account number does not exist!',
        });
      }
      console.log(rows[0]);
      const {
        balance, email, firstname, lastname,
      } = rows[0];
      console.log(rows[0]);
      const newBalance = (balance + transactionAmount).toFixed(2);
      const creditTransactionQuery = `UPDATE accounts SET balance = $1 WHERE accountNumber = $2
                                    RETURNING id, accountNumber, balance`;

      const creditValues = [newBalance, accountNumberParam];
      const { rows: rowsCredit } = await client.query(creditTransactionQuery, creditValues);
      if (rowsCredit[0]) {
        const creditedAccount = rowsCredit[0];
        const {
          id, accountnumber: creditedAccountNumber, balance: creditedAccountBalance,
        } = creditedAccount;
        const addTransactionQuery = `INSERT INTO transactions(accountNumber, type, account, cashier, amount, oldBalance, newBalance)
                                    VALUES($1, $2, $3, $4, $5, $6, $7)
                                    RETURNING id, type, accountNumber, cashier, amount, newBalance, createdOn`;
        const addTransactionValues = [
          creditedAccountNumber,
          inputTransactionType,
          id,
          transactionCashier,
          transactionAmount,
          balance,
          creditedAccountBalance,
        ];
        const {
          rows: rowsAddTransaction,
        } = await client.query(addTransactionQuery, addTransactionValues);
        if (rowsAddTransaction[0]) {
          const {
            id: transactionId,
            type: transactionType,
            accountnumber,
            cashier,
            amount,
            newbalance: accountBalance,
            createdon,
          } = rowsAddTransaction[0];
          const transactionDetails = {
            transactionId,
            accountnumber,
            amount,
            cashier,
            transactionType,
            accountBalance,
          };

          const mailDetails = {
            to: email,
            accountNumber: accountnumber,
            type: transactionType,
            amount,
            id: transactionId,
            date: createdon,
            firstName: firstname,
            lastName: lastname,
            balance: accountBalance,
          };
          await send(mailDetails);

          return res.status(200).json({
            status: 200,
            data: [transactionDetails],
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async debitTransaction(req, res) {
    const client = await pool.connect();
    try {
      const {
        amount: transactionAmount,
        cashier: transactionCashier,
        type: inputTransactionType,
      } = req.body;
      const { accountNumber: accountNumberParam } = req.params;
      const findAccountQuery = `SELECT  email, firstName, balance, lastName from users
                                INNER JOIN accounts ON users.id = accounts.owner
                                WHERE accountNumber = $1`;
      const findValues = [accountNumberParam];
      const { rows } = await client.query(findAccountQuery, findValues);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Account with given account number does not exist!',
        });
      }
      const {
        balance, email, firstname, lastname,
      } = rows[0];
      const newBalance = (balance - transactionAmount).toFixed(2);
      const debitTransactionQuery = `UPDATE accounts SET balance = $1 WHERE accountNumber = $2
                                    RETURNING id, accountNumber, balance`;
      const debitValues = [newBalance, accountNumberParam];
      const { rows: rowsDebit } = await client.query(debitTransactionQuery, debitValues);
      if (rowsDebit[0]) {
        const creditedAccount = rowsDebit[0];
        const {
          id, accountnumber: debitedAccountNumber, balance: debitedAccountBalance,
        } = creditedAccount;
        const addTransactionQuery = `INSERT INTO transactions(accountNumber, type, account, cashier, amount, oldBalance, newBalance)
                                    VALUES($1, $2, $3, $4, $5, $6, $7)
                                    RETURNING id, type, accountNumber, cashier, amount, newBalance, createdOn`;
        const addTransactionValues = [
          debitedAccountNumber,
          inputTransactionType,
          id,
          transactionCashier,
          transactionAmount,
          balance,
          debitedAccountBalance,
        ];
        const {
          rows: rowsAddTransaction,
        } = await client.query(addTransactionQuery, addTransactionValues);
        if (rowsAddTransaction[0]) {
          const {
            id: transactionId,
            type: transactionType,
            accountnumber,
            cashier,
            amount,
            newbalance: accountBalance,
            createdon,
          } = rowsAddTransaction[0];
          const transactionDetails = {
            transactionId,
            accountnumber,
            amount,
            cashier,
            transactionType,
            accountBalance,
          };

          const mailDetails = {
            to: email,
            accountNumber: accountnumber,
            type: transactionType,
            amount,
            id: transactionId,
            date: createdon,
            firstName: firstname,
            lastName: lastname,
            balance: accountBalance,
          };
          await send(mailDetails);

          return res.status(200).json({
            status: 200,
            data: [transactionDetails],
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async getAllTransactions(req, res) {
    const client = await pool.connect();
    try {
      const getAllTransactionsQuery = `SELECT id AS transactionId, createdOn, type, accountNumber, amount, oldBalance, newBalance
                                       FROM transactions ORDER BY id ASC`;

      const { rows } = await client.query(getAllTransactionsQuery);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No transaction records found!',
        });
      }
      const allTransactions = rows;
      return res.status(200).json({
        status: 200,
        data: allTransactions,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async getUserTransaction(req, res) {
    const client = await pool.connect();
    try {
      const { transactionId } = req.params;

      const getUserTransactionQuery = `SELECT id AS transactionId, createdOn, type, accountNumber, amount, oldBalance, newBalance FROM transactions
                                        WHERE id = $1`;
      const values = [transactionId];
      const { rows: userTransactionRows } = await client.query(getUserTransactionQuery, values);
      if (!userTransactionRows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Transaction with specified id does not exist!',
        });
      }
      const userTransaction = userTransactionRows[0];
      return res.status(200).json({
        status: 200,
        data: [userTransaction],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async getUserTransactions(req, res) {
    const client = await pool.connect();
    try {
      const { accountNumber } = req.params;

      const checkExistingAccountQuery = `SELECT * FROM accounts
                                         WHERE accountNumber = $1`;
      const checkValue = [accountNumber];

      const { rows } = await client.query(checkExistingAccountQuery, checkValue);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Account with specified account number does not exist!',
        });
      }

      const getUserTransactionsQuery = `SELECT id AS transactionId, createdOn, type, accountNumber, amount, oldBalance, newBalance FROM transactions
                                        WHERE accountNumber = $1`;
      const values = [accountNumber];
      const { rows: userTransactionsRows } = await client.query(getUserTransactionsQuery, values);
      if (!userTransactionsRows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No transactions record found for the account!',
        });
      }
      const userTransactions = userTransactionsRows;
      return res.status(200).json({
        status: 200,
        data: userTransactions,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }
}

export default TransactionController;
