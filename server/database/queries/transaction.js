const findAccount = `SELECT  email, firstName, balance, status, lastName
                     from users INNER JOIN accounts
                     ON users.id = accounts.owner WHERE accountNumber = $1`;

const transact = `UPDATE accounts SET balance = $1 WHERE accountNumber = $2
                  RETURNING id, accountNumber, balance`;

const addTransaction = `INSERT INTO transactions
                        (accountNumber, type, account, cashier,
                         amount, oldBalance, newBalance)
                        VALUES($1, $2, $3, $4, $5, $6, $7)
                        RETURNING id, type, accountNumber AS accountNumber,
                        cashier, amount, newBalance AS newBalance,
                        createdOn AS createdOn`;

const getAllTransactions = `SELECT id AS transactionId, createdOn as createdOn,
                            type, accountNumber AS accountNumber, amount,
                            oldBalance AS oldBalance, newBalance as newBalance
                            FROM transactions ORDER BY id ASC`;

const getUserTransaction = `SELECT transactions.id AS transactionId,
                            transactions.createdOn AS createdOn,
                            transactions.type,
                            transactions.accountNumber AS accountNumber,
                            transactions.amount,
                            oldBalance AS oldBalance, newBalance as newBalance
                            FROM accounts INNER JOIN transactions
                            ON accounts.id = transactions.account
                            WHERE transactions.id = $1 AND accounts.owner = $2`;

const getTransactionAdmin = `SELECT transactions.id AS transactionId,
                            transactions.createdOn AS createdOn,
                            transactions.type,
                            transactions.accountNumber AS accountNumber,
                            transactions.amount,
                            oldBalance AS oldBalance, newBalance AS newBalance
                            FROM transactions
                            WHERE transactions.id = $1`;

const checkExisting = `SELECT * FROM users INNER JOIN accounts
                       ON users.id = accounts.owner
                       WHERE accountNumber = $1 AND users.id = $2`;

const checkExistingAdmin = `SELECT * FROM accounts
                            WHERE accountNumber = $1`;

const getUserTransactions = `SELECT id AS transactionId, createdOn AS createdOn,
                             type, accountNumber AS accountNumber,
                             amount, oldBalance AS oldBalance,
                             newBalance AS newBalance
                             FROM transactions WHERE accountNumber = $1`;

const getCashierTransactions = `SELECT id AS transactionId,
                                createdOn AS createdOn,
                                type, accountNumber AS accountNumber,
                                amount, cashier,
                                oldBalance AS oldBalance,
                                newBalance AS newBalance
                                FROM transactions WHERE cashier = $1`;

export default {
  findAccount,
  transact,
  addTransaction,
  getAllTransactions,
  getUserTransaction,
  getTransactionAdmin,
  checkExisting,
  checkExistingAdmin,
  getUserTransactions,
  getCashierTransactions,
};
