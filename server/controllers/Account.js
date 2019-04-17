import pool from '../database/db';

import accounts from '../models/accounts';
import ArraySorter from '../helpers/ArraySorter';

const { arrayFinder } = ArraySorter;
const allAccounts = accounts;

class AccountController {
  static async createAccount(req, res) {
    const newAccount = req.body;
    newAccount.id = allAccounts.length + 1;
    newAccount.createdOn = new Date();
    newAccount.status = newAccount.status;
    newAccount.balance = newAccount.openingBalance;
    const { openingBalance, ...account } = newAccount;
    allAccounts.push(account);
    const {
      id,
      createdOn,
      status,
      owner,
      balance,
      ...newAccountDetails
    } = newAccount;
    return res.status(201).json({
      status: 201,
      data: newAccountDetails,
    });
  }

  static async getAccount(req, res) {
    const { accountNumber } = req.params;
    const singleAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
    return res.status(200).json({
      status: 200,
      data: singleAccount,
    });
  }

  static async getAllAccounts(req, res) {
    return res.status(200).json({
      status: 200,
      data: allAccounts,
    });
  }

  static async getUserAccounts(req, res) {
    const client = await pool.connect();
    try {
      const { userId } = req.params;
      const getUserAccountsQuery = `SELECT * FROM accounts WHERE owner = $1
                                  ORDER BY id ASC`;
      const values = [userId];
      const { rows } = await client.query(getUserAccountsQuery, values);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No accounts record found for user with given id!',
        });
      }
      const userAccounts = rows;
      return res.status(200).json({
        status: 200,
        data: userAccounts,
      });
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

  static async updateAccountStatus(req, res) {
    const { status } = req.body;
    const { accountNumber } = req.params;
    const updatedAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
    updatedAccount.status = status;
    const {
      firstName,
      lastName,
      email,
      balance,
      type,
      owner,
      id,
      createdOn,
      ...updatedAccountDetail
    } = updatedAccount;
    return res.status(200).json({
      status: 200,
      data: updatedAccountDetail,
    });
  }

  static async deleteAccount(req, res) {
    const accNumber = req.params.accountNumber;
    const deletedAccount = arrayFinder(allAccounts, 'accountNumber', accNumber);
    allAccounts.splice(allAccounts.indexOf(deletedAccount), 1);
    const deleteSuccess = {
      message: 'Account successfully deleted!',
    };
    return res.status(200).json({
      status: 200,
      data: deleteSuccess,
    });
  }
}

export default AccountController;
