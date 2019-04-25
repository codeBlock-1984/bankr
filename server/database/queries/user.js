const getUser = `SELECT id, firstName, lastName, email,
                 type, isAdmin, createdOn FROM users WHERE id = $1`;

const getAllUsers = `SELECT id, firstName, lastName, email,
                     type, isAdmin, createdOn
                     FROM users ORDER BY id ASC`;

export default {
  getUser,
  getAllUsers,
};
