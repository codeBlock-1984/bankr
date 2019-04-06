import accounts from '../models/accountModel';
import arrayFinder from '../helpers/arrayFinder';

const allAccounts = [...accounts];

class AccountController {
  static async createAccount(req, res) {
    const newAccount = req.body;
    newAccount.status = newAccount.status || 'dormant';
    newAccount.balance = newAccount.openingBalance;
    allAccounts.push(newAccount);
    return res.status(201).json({
      status: 201,
      data: newAccount,
    });
  }

  static async updateAccountStatus(req, res) {
    const { status } = req.body;
    const { accountNumber } = req.params;
    const updatedAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
    updatedAccount.status = status;
    /* eslint-disable no-unused-vars */
    const {
      firstName, lastName, email, openingBalance, type, ...account
    } = updatedAccount;
    return res.status(200).json({
      status: 200,
      data: account,
    });
  }

  static async deleteAccount(req, res) {
    const { accountNumber } = req.params;
    const deletedAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
    const newAccounts = allAccounts.filter((account) => {
      return account.accountNumber !== accountNumber;
    });
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
