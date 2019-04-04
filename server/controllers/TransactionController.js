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
    const { amount } = newCreditTransaction;
    const accountBalance = (openingBalance - parseFloat(amount)).toFixed(2);
    const creditData = { ...newCreditTransaction, accountBalance };
    return res.status(200).json({
      status: 200,
      data: creditData,
    });
  }

  static async debitTransaction(req, res) {
    const newDebitTransaction = req.body;
    newDebitTransaction.id = allTransactions.length + 1;
    const accountNumber = parseInt(req.params.accountNumber, 10);
    const debitedAccount = allAccounts.find((account) => {
      return account.accountNumber === accountNumber;
    });
    const { openingBalance } = debitedAccount;
    const { amount } = newDebitTransaction;
    const accountBalance = (openingBalance - parseFloat(amount)).toFixed(2);
    const debitData = { ...newDebitTransaction, accountBalance };
    return res.status(200).json({
      status: 200,
      data: debitData,
    });
  }
}

export default TransactionController;
