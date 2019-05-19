const addAction = `INSERT INTO actions
                   (firstName, lastName, role, type, email, admin)
                   VALUES($1, $2, $3, $4, $5, $6)`;

const getAllActions = `SELECT firstName, lastName, role, type,
                       email, admin, createdOn as createdOn
                       FROM actions
                       ORDER BY id ASC`;

const getActionAdmin = `SELECT firstName, lastName, role, type,
                        email, admin, createdOn as createdOn
                        FROM actions
                        WHERE admin = $1
                        ORDER BY id ASC`;

export default {
  addAction,
  getAllActions,
  getActionAdmin,
};
