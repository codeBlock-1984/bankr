import transactions from '../models/transactions';
import accounts from '../models/accounts';
import ArraySorter from '../helpers/ArraySorter';

const { arrayFinder, arrayFilter } = ArraySorter;
const allTransactions = transactions;
const allAccounts = accounts;
const transactionCount = allTransactions.length + 1;

class TransactionController {
  static async creditTransaction(req, res) {
    const newCreditTransaction = req.body;
    newCreditTransaction.id = transactionCount;
    const { accountNumber } = req.params;
    const creditedAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
    const { balance } = creditedAccount;
    const { amount } = newCreditTransaction;
    const accBalance = parseFloat(balance + amount).toFixed(2);
    const accountBalance = parseFloat(accBalance);
    const creditData = { ...newCreditTransaction, accountBalance };
    newCreditTransaction.createdOn = new Date();
    newCreditTransaction.oldBalance = parseFloat(balance);
    newCreditTransaction.newBalance = accountBalance;
    allTransactions.push(newCreditTransaction);
    return res.status(200).json({
      status: 200,
      data: creditData,
    });
  }

  static async debitTransaction(req, res) {
    const newDebitTransaction = req.body;
    newDebitTransaction.id = transactionCount;
    const { accountNumber } = req.params;
    const debitedAccount = arrayFinder(allAccounts, 'accountNumber', accountNumber);
    const { balance } = debitedAccount;
    const { amount } = newDebitTransaction;
    const accBalance = parseFloat(balance - amount).toFixed(2);
    const accountBalance = parseFloat(accBalance);
    const debitData = { ...newDebitTransaction, accountBalance };
    newDebitTransaction.createdOn = new Date();
    newDebitTransaction.oldBalance = parseFloat(balance);
    newDebitTransaction.newBalance = accountBalance;
    allTransactions.push(newDebitTransaction);
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

  static async getUserTransactions(req, res) {
    const id = parseInt(req.params.userId, 10);
    const userAccounts = arrayFilter(allAccounts, 'owner', id);
    const userAccountNumbers = userAccounts.map((account) => {
      return account.accountNumber;
    });
    const userTransactions = userAccountNumbers.map((accountNumber) => {
      return arrayFilter(allTransactions, 'accountNumber', accountNumber);
    });
    return res.status(200).json({
      status: 200,
      data: userTransactions,
    });
  }
}

export default TransactionController;
