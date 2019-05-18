const addAction = `INSERT INTO actions
                   (type, owner, admin)
                   VALUES($1, $2, $3)`;

const getAllActions = `SELECT type, firstName, lastName,
                       email, admin, createdOn as createdOn
                       FROM users INNER JOIN actions
                       ON users.id = actions.owner
                       ORDER BY id ASC`;

const getActionAdmin = `SELECT type, firstName, lastName,
                        email, admin, createdOn as createdOn
                        FROM users INNER JOIN actions
                        ON users.id = actions.owner
                        WHERE actions.admin = $1
                        ORDER BY id ASC`;

export default {
  addAction,
  getAllActions,
  getActionAdmin,
};
