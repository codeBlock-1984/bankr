import pool from '../database/db';
import Responder from '../helpers/Responder';
import Auth from '../helpers/Auth';
import accountNumGen from '../helpers/accountNumGen';
import accountQuery from '../database/queries/account';

const { verifyToken } = Auth;
const { successResponse, errorResponse, messageResponse } = Responder;
const {
  createAccount,
  getUser,
  getAccount,
  getAccountsByStatus,
  getAllAccounts,
  getUserAccounts,
  updateAccountStatus,
  deleteAccount,
} = accountQuery;

/**
 * @description Defines actions that can be
 * performed on the account resource
 *
 * @class AccountController
 */

class AccountController {
  /**
   * @description Creates a new bank account
   * @static
   * @async
   *
   * @param {object} req - create account request object
   * @param {object} res - create account response object
   * @returns
   * @memberof AccountController
   */
  static async createAccount(req, res) {
    const client = await pool.connect();
    try {
      const { type: accountType } = req.body;

      const token = req.headers['x-auth-token'];
      const { userId } = await verifyToken(token);
      const accountOwner = userId;
      const accountOpeningBalance = parseFloat('0.00');

      const accountNumber = accountNumGen();
      const status = 'active';

      const values = [
        accountNumber,
        accountOwner,
        accountType,
        status,
        accountOpeningBalance,
      ];

      const { rows } = await client.query(createAccount, values);

      if (rows[0]) {
        const newAccount = rows[0];

        const {
          accountnumber,
          type,
          balance: openingBalance,
        } = newAccount;

        const getUserValue = [accountNumber];

        const { rows: userRows } = await client.query(getUser, getUserValue);

        const { firstname, lastname, email } = userRows[0];

        const newAccountDetails = {
          firstname,
          lastname,
          email,
          accountnumber,
          type,
          openingBalance,
        };

        return res.status(201)
          .json(successResponse([newAccountDetails]));
      }
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Gets a bank account
   * @static
   * @async
   *
   * @param {object} req - get account request object
   * @param {object} res - get account response object
   * @returns
   * @memberof AccountController
   */
  static async getAccount(req, res) {
    const client = await pool.connect();

    try {
      const { accountNumber } = req.params;
      const values = [accountNumber];
      const { rows } = await client.query(getAccount, values);

      if (!rows[0]) {
        const error = 'Account with specified account number does not exist!';
        return res.status(404)
          .json(errorResponse(error));
      }

      const singleAccount = rows[0];

      const {
        createdon,
        accountnumber,
        email: ownerEmail,
        type,
        status,
        balance,
      } = singleAccount;

      const retrievedAccount = {
        createdon,
        accountnumber,
        ownerEmail,
        type,
        status,
        balance,
      };

      return res.status(200)
        .json(successResponse([retrievedAccount]));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Gets all bank accounts
   * @static
   * @async
   *
   * @param {object} req - get all accounts request object
   * @param {object} res - get all accounts response object
   * @returns
   * @memberof AccountController
   */
  static async getAllAccounts(req, res) {
    const client = await pool.connect();

    try {
      const statusQuery = req.query.status;

      if (statusQuery) {
        const values = [statusQuery];
        const {
          rows: getAccountsRows,
        } = await client.query(getAccountsByStatus, values);

        if (!getAccountsRows[0]) {
          return res.status(404)
            .json(errorResponse(`No ${statusQuery} accounts found!`));
        }

        const userAccountsByStatus = getAccountsRows;
        return res.status(200)
          .json(successResponse(userAccountsByStatus));
      }

      const { rows } = await client.query(getAllAccounts);

      if (!rows[0]) {
        return res.status(404)
          .json(errorResponse('No account records found!'));
      }

      const allBankAccounts = rows;

      return res.status(200)
        .json(successResponse(allBankAccounts));
    } catch (error) {
      return res.status(500).json('Internal server error!');
    } finally {
      await client.release();
    }
  }

  /**
   * @description Gets User's bank accounts
   * @static
   * @async
   *
   * @param {object} req - get user accounts request object
   * @param {object} res - get user accounts response object
   * @returns
   * @memberof AccountController
   */
  static async getUserAccounts(req, res) {
    const client = await pool.connect();

    try {
      const { email } = req.params;
      const values = [email];
      const { rows } = await client.query(getUserAccounts, values);

      if (!rows[0]) {
        const error = 'No accounts record found with the specified email!';
        return res.status(404)
          .json(errorResponse(error));
      }

      const userAccounts = rows;

      return res.status(200)
        .json(successResponse(userAccounts));
    } catch (error) {
      return res.status(500).json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Updates a bank account's status
   * @static
   * @async
   *
   * @param {object} req - update account request object
   * @param {object} res - update account response object
   * @returns
   * @memberof AccountController
   */
  static async updateAccountStatus(req, res) {
    const client = await pool.connect();
    try {
      const { accountNumber } = req.params;
      const { status } = req.body;

      const values = [status, accountNumber];
      const { rows } = await client.query(updateAccountStatus, values);

      if (!rows[0]) {
        const error = 'Account with specified account number does not exist!';
        return res.status(404)
          .json(errorResponse(error));
      }

      const updatedAccount = rows[0];

      return res.status(200)
        .json(successResponse([updatedAccount]));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }

  /**
   * @description Deletes a bank account
   * @static
   * @async
   *
   * @param {object} req - delete account request object
   * @param {object} res - delete account response object
   *
   * @returns
   * @memberof AccountController
   */
  static async deleteAccount(req, res) {
    const client = await pool.connect();

    try {
      const { accountNumber } = req.params;

      const values = [accountNumber];
      const { rows } = await client.query(deleteAccount, values);

      if (!rows[0]) {
        const error = 'Account with specified account number does not exist!';
        return res.status(404)
          .json(errorResponse(error));
      }

      return res.status(200)
        .json(messageResponse('Account successfully deleted!'));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }
}

export default AccountController;
