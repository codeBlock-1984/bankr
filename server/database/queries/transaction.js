const findAccount = `SELECT  email, firstName, balance, lastName from users
INNER JOIN accounts ON users.id = accounts.owner WHERE accountNumber = $1`;

const transact = `UPDATE accounts SET balance = $1 WHERE accountNumber = $2
RETURNING id, accountNumber, balance`;

const addTransaction = `INSERT INTO transactions
                        (accountNumber, type, account, cashier,
                         amount, oldBalance, newBalance)
                        VALUES($1, $2, $3, $4, $5, $6, $7)
                        RETURNING id, type, accountNumber, cashier,
                        amount, newBalance, createdOn`;

const getAllTransactions = `SELECT id AS transactionId, createdOn, type,
                            accountNumber, amount, oldBalance, newBalance
                            FROM transactions ORDER BY id ASC`;

const getUserTransaction = `SELECT transactions.id AS transactionId,
                            transactions.createdOn, transactions.type,
                            transactions.accountNumber, transactions.amount,
                            oldBalance, newBalance
                            FROM accounts INNER JOIN transactions
                            ON accounts.id = transactions.account
                            WHERE transactions.id = $1 AND accounts.owner = $2`;

const checkExisting = `SELECT * FROM users INNER JOIN accounts
                       ON users.id = accounts.owner
                       WHERE accountNumber = $1 AND users.id = $2`;

const getUserTransactions = `SELECT id AS transactionId, createdOn, type,
                             accountNumber, amount, oldBalance, newBalance
                             FROM transactions WHERE accountNumber = $1`;

export default {
  findAccount,
  transact,
  addTransaction,
  getAllTransactions,
  getUserTransaction,
  checkExisting,
  getUserTransactions,
};
