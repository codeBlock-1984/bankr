import transactions from '../models/transactionModel';
import accounts from '../models/accountModel';

const allTransactions = transactions;
const allAccounts = accounts;

class TransactionController {
  static async creditTransaction(req, res) {
    const newCreditTransaction = req.body;
    newCreditTransaction.id = allTransactions.length + 1;
    const accountNumber = parseInt(req.params.accountNumber, 10);
    const creditedAccount = allAccounts.find((account) => {
      return account.accountNumber === accountNumber;
    });
    const { openingBalance } = creditedAccount;
    // console.log(openingBalance);
    const { amount } = newCreditTransaction;
    const accountBalance = openingBalance + parseFloat(amount);
    // console.log(accountBalance);
    // console.log(openingBalance);
    // console.log(amount);
    const creditData = { ...newCreditTransaction, accountBalance };
    return res.status(200).json({
      status: 200,
      data: creditData,
    });
  }
}

export default TransactionController;
