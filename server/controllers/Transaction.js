import pool from '../database/db';

import transactions from '../models/transactions';
import accounts from '../models/accounts';
import ArraySorter from '../helpers/ArraySorter';

const { arrayFinder } = ArraySorter;
const allTransactions = transactions;
const allAccounts = accounts;
const transactionCount = allTransactions.length + 1;

class TransactionController {
  static async creditTransaction(req, res) {
    const client = await pool.connect();
    try {
      const {
        accountNumber: transactionAccountNumber,
        amount: transactionAmount,
        account: transactionAccount,
        owner: transactionOwner,
        cashier: transactionCashier,
        type: inputTransactionType,
      } = req.body;
      const { accountNumber: accountNumberParam } = req.params;
      const findAccountQuery = `SELECT * FROM accounts WHERE accountNumber = $1
                              LIMIT 1`;
      const findValues = [accountNumberParam];
      const { rows } = await client.query(findAccountQuery, findValues);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Account with given account number does not exist!',
        });
      }
      const { balance } = rows[0];
      const newBalance = (balance + transactionAmount).toFixed(2);
      const creditTransactionQuery = `UPDATE accounts SET balance = $1 WHERE accountNumber = $2
                                    RETURNING balance`;
      const creditValues = [newBalance, accountNumberParam];
      const { rows: rowsCredit } = await client.query(creditTransactionQuery, creditValues);
      if (rowsCredit[0]) {
        const creditedAccount = rowsCredit[0];
        const { balance: creditedAccountBalance } = creditedAccount;
        const addTransactionQuery = `INSERT INTO transactions(type, accountNumber, account, owner, cashier, amount, oldBalance, newBalance)
                                    VALUES($1, $2, $3, $4, $5, $6, $7)
                                    RETURNING id, type, accountNumber, account, owner, cashier, amount, newBalance`;
        const addTransactionValues = [
          inputTransactionType,
          transactionAccountNumber,
          transactionAccount,
          transactionOwner,
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
            account,
            owner,
            cashier,
            amount,
            newbalance: accountBalance,
          } = rowsAddTransaction[0];
          const transactionDetails = {
            transactionId,
            accountnumber,
            amount,
            account,
            owner,
            cashier,
            transactionType,
            accountBalance,
          };
          return res.status(201).json({
            status: 201,
            data: transactionDetails,
          });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async debitTransaction(req, res) {
    const newDebitTransaction = req.body;
    newDebitTransaction.id = transactionCount;
    const { accountNumber } = req.params;
    const debitedAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
    const { balance } = debitedAccount;
    const { amount } = newDebitTransaction;
    const accBalance = parseFloat(balance - amount).toFixed(2);
    const accountBalance = parseFloat(accBalance);
    const debitData = { ...newDebitTransaction, accountBalance };
    newDebitTransaction.createdOn = new Date();
    newDebitTransaction.oldBalance = parseFloat(balance);
    newDebitTransaction.newBalance = accountBalance;
    allTransactions.push(newDebitTransaction);
    return res.status(200).json({
      status: 200,
      data: debitData,
    });
  }

  static async getTransaction(req, res) {
    const transactionId = parseInt(req.params.transactionId, 10);
    const singleTransaction = arrayFinder(allTransactions, 'id', transactionId);
    return res.status(200).json({
      status: 200,
      data: singleTransaction,
    });
  }

  static async getAllTransactions(req, res) {
    return res.status(200).json({
      status: 200,
      data: allTransactions,
    });
  }

  static async getUserTransaction(req, res) {
    const client = await pool.connect();
    try {
      const { userId, accountId, transactionId } = req.params;
      const getUserTransactionQuery = `SELECT * FROM transactions LIMIT 1
                                        WHERE owner = $1 AND account = $2 AND id = $3
                                        `;
      const values = [userId, accountId, transactionId];
      const { rows: userTransactionRows } = await client.query(getUserTransactionQuery, values);
      if (!userTransactionRows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No transactions record found with given user id!',
        });
      }
      const userTransaction = userTransactionRows[0];
      return res.status(200).json({
        status: 200,
        data: userTransaction,
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
      const { userId, accountId } = req.params;
      const getUserTransactionsQuery = `SELECT * FROM transactions WHERE owner = $1 AND account = $2
                                      ORDER BY id ASC`;
      const values = [userId, accountId];
      const { rows: userTransactionsRows } = await client.query(getUserTransactionsQuery, values);
      if (!userTransactionsRows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No transactions record matching user id and account id!',
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
