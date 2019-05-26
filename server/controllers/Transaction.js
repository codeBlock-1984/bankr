import pool from '../database/db';
import Mailer from '../helpers/Mailer';
import Responder from '../helpers/Responder';
import Auth from '../helpers/Auth';
import transactionQuery from '../database/queries/transaction';

const { send } = Mailer;
const { verifyToken } = Auth;
const { successResponse, errorResponse } = Responder;
const {
  findAccount,
  transact,
  addTransaction,
  getAllTransactions,
  getUserTransaction,
  getTransactionAdmin,
  checkExisting,
  checkExistingAdmin,
  getUserTransactions,
  getCashierTransactions,
} = transactionQuery;

/**
 * @description Defines actions
 * that can be performed on the transaction resource
 *
 * @class TransactionController
 */
class TransactionController {
  /**
   * @description Credits a bank account
   * @static
   * @async
   *
   * @param {object} req - credit transaction request object
   * @param {object} res - credit transaction response object
   *
   * @returns
   * @memberof TransactionController
   */
  static async creditTransaction(req, res) {
    const client = await pool.connect();

    try {
      const { amount: transactionAmount } = req.body;
      const inputTransactionType = 'credit';
      const token = req.headers['x-auth-token'];
      const { userId: transactionCashier } = await verifyToken(token);
      const { accountNumber: accountNumberParam } = req.params;

      const findValues = [accountNumberParam];
      const { rows } = await client.query(findAccount, findValues);

      if (!rows[0]) {
        const error = 'Account with given account number does not exist!';
        return res.status(404)
          .json(errorResponse(error));
      }

      const {
        balance,
        email,
        firstname,
        lastname,
      } = rows[0];

      const newBalance = (balance + transactionAmount).toFixed(2);

      const creditValues = [newBalance, accountNumberParam];
      const { rows: rowsCredit } = await client.query(transact, creditValues);

      if (rowsCredit[0]) {
        const creditedAccount = rowsCredit[0];
        const {
          id,
          accountnumber: creditedAccountNumber,
          balance: creditedAccountBalance,
        } = creditedAccount;

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
        } = await client.query(addTransaction, addTransactionValues);

        if (rowsAddTransaction[0]) {
          const {
            id: transactionId,
            type: transactionType,
            accountnumber: accountNumber,
            cashier,
            amount,
            newbalance: accountBalance,
            createdon,
          } = rowsAddTransaction[0];

          const transactionDetails = {
            transactionId,
            accountNumber,
            amount,
            cashier,
            transactionType,
            accountBalance,
          };

          const mailDetails = {
            to: email,
            accountNumber,
            type: transactionType,
            amount,
            id: transactionId,
            date: createdon,
            firstname,
            lastname,
            balance: accountBalance,
          };

          await send(mailDetails);

          const msg = 'Credit transaction was successful.';
          return res.status(200)
            .json(successResponse(msg, [transactionDetails]));
        }
      }
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description debits a bank account
   * @static
   * @async
   *
   * @param {object} req - debit transaction request object
   * @param {object} res - debit transaction response object
   *
   * @returns
   * @memberof TransactionController
   */
  static async debitTransaction(req, res) {
    const client = await pool.connect();

    try {
      const { amount: transactionAmount } = req.body;
      const inputTransactionType = 'debit';
      const token = req.headers['x-auth-token'];
      const { userId: transactionCashier } = await verifyToken(token);
      const { accountNumber: accountNumberParam } = req.params;

      const findValues = [accountNumberParam];
      const { rows } = await client.query(findAccount, findValues);

      if (!rows[0]) {
        const error = 'Account with given account number does not exist!';
        return res.status(404)
          .json(errorResponse(error));
      }

      const {
        balance,
        email,
        firstname,
        lastname,
        status,
      } = rows[0];

      if (status === 'dormant') {
        const error = 'You cannot debit a dormant account!';
        return res.status(400).json(errorResponse(error));
      }
      if (balance < transactionAmount) {
        const error = 'Insufficient funds!';
        return res.status(400).json(errorResponse(error));
      }

      const newBalance = (balance - transactionAmount).toFixed(2);

      const debitValues = [newBalance, accountNumberParam];
      const { rows: rowsDebit } = await client.query(transact, debitValues);

      if (rowsDebit[0]) {
        const creditedAccount = rowsDebit[0];

        const {
          id,
          accountnumber: debitedAccountNumber,
          balance: debitedAccountBalance,
        } = creditedAccount;

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
        } = await client.query(addTransaction, addTransactionValues);

        if (rowsAddTransaction[0]) {
          const {
            id: transactionId,
            type: transactionType,
            accountnumber: accountNumber,
            cashier,
            amount,
            newbalance: accountBalance,
            createdon,
          } = rowsAddTransaction[0];

          const transactionDetails = {
            transactionId,
            accountNumber,
            amount,
            cashier,
            transactionType,
            accountBalance,
          };

          const mailDetails = {
            to: email,
            accountNumber,
            type: transactionType,
            amount,
            id: transactionId,
            date: createdon,
            firstname,
            lastname,
            balance: accountBalance,
          };

          await send(mailDetails);

          const msg = 'Debit transaction was successful.';
          return res.status(200)
            .json(successResponse(msg, [transactionDetails]));
        }
      }
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Gets all transactions
   * @static
   * @async
   *
   * @param {object} req - get transactions request object
   * @param {object} res - get transactions response object
   *
   * @returns
   * @memberof TransactionController
   */
  static async getAllTransactions(req, res) {
    const client = await pool.connect();

    try {
      const { rows } = await client.query(getAllTransactions);

      if (!rows[0]) {
        return res.status(404)
          .json(errorResponse('No transaction records found!'));
      }

      const allTransactions = rows;

      const msg = 'Successfully retrieved all transaction records.';
      return res.status(200)
        .json(successResponse(msg, allTransactions));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Gets a specific user's transaction
   * @static
   * @async
   *
   * @param {object} req - get user transaction request object
   * @param {object} res - get user transaction response object
   *
   * @returns
   * @memberof TransactionController
   */
  static async getUserTransaction(req, res) {
    const client = await pool.connect();

    try {
      const { transactionId: idParam } = req.params;

      const token = req.headers['x-auth-token'];
      const { userId, userType } = await verifyToken(token);
      let getTransactionRows;

      if (userType === 'client') {
        const values = [idParam, userId];
        const { rows } = await client.query(getUserTransaction, values);
        getTransactionRows = rows;
      } else {
        const values = [idParam];
        const { rows } = await client.query(getTransactionAdmin, values);
        getTransactionRows = rows;
      }

      if (!getTransactionRows[0]) {
        return res.status(404)
          .json(errorResponse('Transaction with specified id does not exist!'));
      }

      const {
        transactionid: transactionId,
        type,
        accountnumber: accountNumber,
        amount,
        oldbalance: oldBalance,
        newbalance: newBalance,
        createdon: createdOn,
      } = getTransactionRows[0];

      const userTransaction = {
        transactionId,
        type,
        accountNumber,
        amount,
        oldBalance,
        newBalance,
        createdOn,
      };

      const msg = 'Successfully retrieved one transaction record.';

      return res.status(200)
        .json(successResponse(msg, [userTransaction]));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Gets a specific user's transactions
   * @static
   * @async
   *
   * @param {object} req - get user transactions request object
   * @param {object} res - get user transactions response object
   *
   * @returns
   * @memberof TransactionController
   */
  static async getUserTransactions(req, res) {
    const client = await pool.connect();

    try {
      const { accountNumber } = req.params;
      const token = req.headers['x-auth-token'];
      const { userId, userType } = await verifyToken(token);

      let checkExistingRows;

      if (userType === 'client') {
        const checkValues = [accountNumber, userId];
        const { rows } = await client.query(checkExisting, checkValues);
        checkExistingRows = rows;
      } else {
        const checkValues = [accountNumber];
        const { rows } = await client.query(checkExistingAdmin, checkValues);
        checkExistingRows = rows;
      }

      if (!checkExistingRows[0]) {
        const error = 'No user account with the given account number!';
        return res.status(404)
          .json(errorResponse(error));
      }

      const values = [accountNumber];
      const {
        rows: userTransactionsRows,
      } = await client.query(getUserTransactions, values);

      if (!userTransactionsRows[0]) {
        return res.status(404)
          .json(errorResponse('No transactions record found for the account!'));
      }
      const userTransactions = userTransactionsRows;

      const msg = 'Successfully retrieved user transaction records.';
      return res.status(200)
        .json(successResponse(msg, userTransactions));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Gets a specific cashier's transactions
   * @static
   * @async
   *
   * @param {object} req - get cashier transactions request object
   * @param {object} res - get cashier transactions response object
   *
   * @returns
   * @memberof TransactionController
   */
  static async getCashierTransactions(req, res) {
    const client = await pool.connect();

    try {
      const token = req.headers['x-auth-token'];
      const { userId: cashier } = await verifyToken(token);

      const values = [cashier];
      const { rows } = await client.query(getCashierTransactions, values);

      if (!rows[0]) {
        return res.status(404)
          .json(errorResponse('No transactions record found for cashier!'));
      }

      const cashierTransactions = rows;

      const msg = `Successfully retrieved cashier's transaction records.`;

      return res.status(200)
        .json(successResponse(msg, cashierTransactions));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }
}

export default TransactionController;
