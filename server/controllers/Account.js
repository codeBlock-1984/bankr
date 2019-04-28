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
  getAccountAdmin,
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
      const { type: accountType, owner } = req.body;

      const token = req.headers['x-auth-token'];
      const { userId, userType } = await verifyToken(token);
      let accountOwner;
      if (owner) {
        accountOwner = owner;
      } else if (userType === 'client') {
        accountOwner = userId;
      } else {
        const error = 'Owner is required.';
        return res.status(400).json(errorResponse(error));
      }
      console.log(accountOwner);

      const accountOpeningBalance = parseFloat('0.00');

      const newAccountNumber = accountNumGen();
      const status = 'active';

      const values = [
        newAccountNumber,
        accountOwner,
        accountType,
        status,
        accountOpeningBalance,
      ];

      const { rows } = await client.query(createAccount, values);

      if (rows[0]) {
        const newAccount = rows[0];

        const {
          accountnumber: accountNumber,
          type,
          balance: openingBalance,
        } = newAccount;

        const getUserValue = [accountNumber];

        const { rows: userRows } = await client.query(getUser, getUserValue);

        const { firstname: firstName, lastname: lastName, email } = userRows[0];

        const newAccountDetails = {
          firstName,
          lastName,
          email,
          accountNumber,
          type,
          openingBalance,
        };

        const msg = 'Account successfully created.';
        return res.status(201)
          .json(successResponse(msg, [newAccountDetails]));
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
      const { accountNumber: accountNumberParam } = req.params;

      const token = req.headers['x-auth-token'];
      const { userId, userType } = await verifyToken(token);
      let getAccountRows;

      if (userType === 'client') {
        console.log(userId);
        console.log(accountNumberParam);
        const values = [accountNumberParam, userId];
        const { rows } = await client.query(getAccount, values);
        console.log(rows);
        getAccountRows = rows;
      } else {
        const values = [accountNumberParam];
        const { rows } = await client.query(getAccountAdmin, values);
        getAccountRows = rows;
      }

      if (!getAccountRows[0]) {
        const error = 'Account with specified account number not found!';
        return res.status(404)
          .json(errorResponse(error));
      }

      const singleAccount = getAccountRows[0];

      const {
        createdon: createdOn,
        accountnumber: accountNumber,
        email: ownerEmail,
        type,
        status,
        balance,
      } = singleAccount;

      const retrievedAccount = {
        createdOn,
        accountNumber,
        ownerEmail,
        type,
        status,
        balance,
      };

      const msg = 'Successfully retrieved one account.';
      return res.status(200)
        .json(successResponse(msg, [retrievedAccount]));
    } catch (error) {
      console.log(error);
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
        const message = `Successfully retrieved all ${statusQuery} accounts.`;
        return res.status(200)
          .json(successResponse(message, userAccountsByStatus));
      }

      const { rows } = await client.query(getAllAccounts);

      if (!rows[0]) {
        return res.status(404)
          .json(errorResponse('No account records found!'));
      }

      const allBankAccounts = rows;

      const msg = 'Successfully retrieved all accounts.';
      return res.status(200)
        .json(successResponse(msg, allBankAccounts));
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

      const msg = 'Successfully retrieved user accounts.';
      return res.status(200)
        .json(successResponse(msg, userAccounts));
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
      const { accountNumber: accountNumberParam } = req.params;
      const { status: statusParam } = req.body;

      const values = [statusParam, accountNumberParam];
      const { rows } = await client.query(updateAccountStatus, values);

      if (!rows[0]) {
        const error = 'Account with specified account number does not exist!';
        return res.status(404)
          .json(errorResponse(error));
      }

      const {
        createdon: createdOn,
        accountnumber: accountNumber,
        email: ownerEmail,
        type,
        status,
        balance,
      } = rows[0];

      const updatedAccount = {
        createdOn,
        accountNumber,
        ownerEmail,
        type,
        status,
        balance,
      };

      const msg = 'Successfully updated account status.';
      return res.status(200)
        .json(successResponse(msg, [updatedAccount]));
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

      const { id } = rows[0];
      return res.status(200)
        .json(messageResponse(`Account with id ${id} successfully deleted!`));
    } catch (error) {
      return res.status(500)
        .json(errorResponse('Internal server error!'));
    } finally {
      await client.release();
    }
  }
}

export default AccountController;
