import transactions from '../models/transactionModel';
import accounts from '../models/accountModel';
import arrayFinder from '../helpers/arrayFinder';

const allTransactions = [...transactions];
const allAccounts = [...accounts];

class TransactionController {
  static async creditTransaction(req, res) {
    const newCreditTransaction = req.body;
    newCreditTransaction.id = allTransactions.length + 1;
    const accountNumber = parseInt(req.params.accountNumber, 10);
    const creditedAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
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
    const debitedAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
    const { openingBalance } = debitedAccount;
    const { amount } = newDebitTransaction;
    const accountBalance = (openingBalance - parseFloat(amount)).toFixed(2);
    const debitData = { ...newDebitTransaction, accountBalance };
    return res.status(200).json({
      status: 200,
      data: debitData,
    });
  }

  static async getTransaction(req, res) {
    const transactionId = parseInt(req.params.transactionId, 10);
    const singleTransaction = arrayFinder(allTransactions, 'id', transactionId);
    return res.status(200).json({
      status: 200,
      data: singleTransaction,
    });
  }

  static async getAllTransactions(req, res) {
    return res.status(200).json({
      status: 200,
      data: allTransactions,
    });
  }
}

export default TransactionController;
