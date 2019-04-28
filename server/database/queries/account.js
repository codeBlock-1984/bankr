const createAccount = `INSERT INTO accounts
                       (accountNumber, owner, type, status, balance)
                       VALUES($1, $2, $3, $4, $5)
                       RETURNING accountNumber, type, balance`;

const getUser = `SELECT firstName, lastName, email FROM users
                 INNER JOIN accounts ON users.id = accounts."owner"
                 WHERE accounts.accountnumber = $1`;

const getAccount = `SELECT accounts.createdOn, accounts.accountNumber, email,
                    accounts.type, status, balance
                    FROM users INNER JOIN accounts
                    ON users.id = accounts.owner
                    WHERE accounts.accountnumber = $1 AND accounts.owner = $2`;

const getAccountAdmin = `SELECT accounts.createdOn, accounts.accountNumber,
                         email,
                        accounts.type, status, balance
                        FROM users INNER JOIN accounts
                        ON users.id = accounts.owner
                        WHERE accounts.accountnumber = $1`;

const getAccountsByStatus = `SELECT * FROM accounts WHERE status = $1
                             ORDER BY id ASC`;

const getAllAccounts = `SELECT * FROM accounts ORDER BY id ASC`;

const getUserAccounts = `SELECT accounts.createdOn, accountNumber,
                         accounts.type, accounts.status, balance
                         FROM users INNER JOIN accounts
                         ON users.id = accounts.owner
                         WHERE users.email = $1 ORDER BY accounts.id ASC`;

const getUserAccountsClient = `SELECT accounts.createdOn, accountNumber,
                              accounts.type, accounts.status, balance
                              FROM users INNER JOIN accounts
                              ON users.id = accounts.owner
                              WHERE users.email = $1 AND accounts.owner = $2
                              ORDER BY accounts.id ASC`;

const updateAccountStatus = `UPDATE accounts SET status = $1
                             WHERE accountNumber = $2
                             RETURNING accountNumber, status`;

const deleteAccount = `DELETE FROM accounts WHERE accountNumber = $1
                       RETURNING id`;

export default {
  createAccount,
  getUser,
  getAccount,
  getAccountAdmin,
  getAccountsByStatus,
  getAllAccounts,
  getUserAccounts,
  getUserAccountsClient,
  updateAccountStatus,
  deleteAccount,
};
