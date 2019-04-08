import accounts from '../models/accountModel';
import ArraySorter from '../helpers/ArraySorter';

const { arrayFinder, arrayFilterNot } = ArraySorter;
const allAccounts = accounts;

class AccountController {
  static async createAccount(req, res) {
    const newAccount = req.body;
    newAccount.id = allAccounts.length + 1;
    newAccount.createdOn = new Date();
    newAccount.status = newAccount.status || 'dormant';
    newAccount.balance = newAccount.openingBalance;
    // eslint-disable-next-line
    const { openingBalance, ...account } = newAccount;
    allAccounts.push(account);
    // eslint-disable-next-line
    const { id, createdOn, status, owner, balance, ...newAccountDetails } = newAccount;
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

  static async updateAccountStatus(req, res) {
    const { status } = req.body;
    const { accountNumber } = req.params;
    const updatedAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
    updatedAccount.status = status;
    const {
      // eslint-disable-next-line
      firstName, lastName, email, balance, type, owner, id, createdOn, ...updatedAccountDetail
    } = updatedAccount;
    return res.status(200).json({
      status: 200,
      data: updatedAccountDetail,
    });
  }

  static async deleteAccount(req, res) {
    const accNumber = req.params.accountNumber;
    // eslint-disable-next-line
    const deletedAccount = arrayFinder(allAccounts, 'accountNumber', accNumber);
    // eslint-disable-next-line
    const newAccounts = arrayFilterNot(allAccounts, 'accountNumber', accNumber);
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
