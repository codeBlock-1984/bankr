import pool from '../database/db';

class AccountController {
  static async createAccount(req, res) {
    const client = await pool.connect();
    try {
      const {
        accountNumber,
        owner: accountOwner,
        type: accountType,
        status,
        openingBalance: accountOpeningBalance,
      } = req.body;

      const createAccountQuery = `INSERT INTO accounts (accountNumber, owner, type, status, balance)
                                  VALUES($1, $2, $3, $4, $5)
                                  RETURNING accountNumber, type, balance`;
      const values = [
        accountNumber,
        accountOwner,
        accountType,
        status,
        accountOpeningBalance,
      ];
      const { rows } = await client.query(createAccountQuery, values);
      if (rows[0]) {
        const newAccount = rows[0];
        const {
          accountnumber, type, balance: openingBalance,
        } = newAccount;

        const getUserQuery = `SELECT firstName, lastName, email FROM users
                              INNER JOIN accounts ON users.id = accounts."owner"
                              WHERE accounts.accountnumber = $1`;
        const getUserValue = [accountNumber];
        const { rows: userRows } = await client.query(getUserQuery, getUserValue);
        const { firstname, lastname, email } = userRows[0];
        const newAccountDetails = {
          firstname, lastname, email, accountnumber, type, openingBalance,
        };
        return res.status(201).json({
          status: 201,
          data: [newAccountDetails],
        });
      }
    } catch (error) {
      const { constraint, code } = error;
      if (constraint === 'accounts_accountnumber_key' || code === '23505') {
        return res.status(409).json({
          status: 409,
          error: 'Account number is linked to an existing account!',
        });
      }
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
        newerror: error,
      });
    } finally {
      await client.release();
    }
  }

  static async getAccount(req, res) {
    const client = await pool.connect();
    try {
      const { accountNumber } = req.params;
      const getAccountQuery = `SELECT accounts.createdOn, accounts.accountNumber, email,
                               accounts.type, status, balance FROM users INNER JOIN accounts
                               ON users.id = accounts.owner WHERE accounts.accountnumber = $1`;
      const values = [accountNumber];
      const { rows } = await client.query(getAccountQuery, values);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Account with specified account number does not exist!',
        });
      }
      const singleAccount = rows[0];
      const {
        createdon, accountnumber, email: ownerEmail, type, status, balance,
      } = singleAccount;
      const retrievedAccount = {
        createdon, accountnumber, ownerEmail, type, status, balance,
      };

      return res.status(200).json({
        status: 200,
        data: [retrievedAccount],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async getAllAccounts(req, res) {
    const client = await pool.connect();
    try {
      const statusQuery = req.query.status;
      if (statusQuery) {
        const getAccountsByStatusQuery = `SELECT * FROM accounts WHERE status = $1
                                          ORDER BY id ASC`;
        const values = [statusQuery];
        const { rows } = await client.query(getAccountsByStatusQuery, values);
        if (!rows[0]) {
          return res.status(404).json({
            status: 404,
            error: `No ${statusQuery} accounts found!`,
          });
        }
        const userAccountsByStatus = rows;
        return res.status(200).json({
          status: 200,
          data: userAccountsByStatus,
        });
      }
      const getAllAccountsQuery = `SELECT * FROM accounts ORDER BY id ASC`;
      const { rows } = await client.query(getAllAccountsQuery);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No account records found!',
        });
      }
      const allBankAccounts = rows;
      return res.status(200).json({
        status: 200,
        data: allBankAccounts,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async getUserAccounts(req, res) {
    const client = await pool.connect();
    try {
      const { email } = req.params;
      const getUserAccountsQuery = `SELECT accounts.createdOn, accountNumber, accounts.type, accounts.status, balance
                                    FROM users INNER JOIN accounts ON users.id = accounts.owner
                                    WHERE users.email = $1 ORDER BY accounts.id ASC;`;
      const values = [email];
      const { rows } = await client.query(getUserAccountsQuery, values);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No accounts record found with the specified email!',
        });
      }
      const userAccounts = rows;
      return res.status(200).json({
        status: 200,
        data: userAccounts,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async updateAccountStatus(req, res) {
    const client = await pool.connect();
    try {
      const { accountNumber } = req.params;
      const { status } = req.body;
      const updateAccountStatusQuery = `UPDATE accounts SET status = $1 WHERE accountNumber = $2
                                  RETURNING accountNumber, status`;
      const values = [status, accountNumber];
      const { rows } = await client.query(updateAccountStatusQuery, values);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Account with specified account number does not exist!',
        });
      }
      const updatedAccount = rows[0];
      return res.status(200).json({
        status: 200,
        data: [updatedAccount],
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }

  static async deleteAccount(req, res) {
    const client = await pool.connect();
    try {
      const { accountNumber } = req.params;
      const deleteAccountQuery = `DELETE FROM accounts WHERE accountNumber = $1
                                  RETURNING id`;
      const values = [accountNumber];
      const { rows } = await client.query(deleteAccountQuery, values);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Account with specified account number does not exist!',
        });
      }
      return res.status(200).json({
        status: 200,
        message: 'Account successfully deleted!',
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: 'Internal server error!',
      });
    } finally {
      await client.release();
    }
  }
}

export default AccountController;
