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
}

export default AccountController;
