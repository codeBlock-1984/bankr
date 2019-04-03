import accounts from '../models/accountModel';

const allAccounts = accounts;

class AccountController {
  static async createAccount(req, res) {
    const newAccount = req.body;
    newAccount.status = newAccount.status || 'dormant';
    allAccounts.push(newAccount);
    return res.status(201).json({
      status: 201,
      data: newAccount,
    });
  }

  static async updateAccountStatus(req, res) {
    const { status } = req.body;
    const { accountNumber } = req.params;
    const updatedAccount = allAccounts.find((account) => {
      return account.accountNumber === accountNumber;
    });
    updatedAccount.status = status;
    /* eslint-disable no-unused-vars */
    const {
      firstName, lastName, email, openingBalance, type, ...account
    } = updatedAccount;
    /* eslint-disable no-unused-vars */
    return res.status(200).json({
      status: 200,
      data: account,
    });
  }
}

export default AccountController;
