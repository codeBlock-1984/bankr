const getUser = `SELECT id, firstName AS firstName, lastName AS lastName, email,
                 type, isAdmin as isAdmin, createdOn AS createdOn FROM users
                 WHERE id = $1`;

const getAllUsers = `SELECT id, firstName AS firstName, lastName AS lastName,
                     email, type, isAdmin as isAdmin, createdOn AS createdOn
                     FROM users ORDER BY id ASC`;

export default {
  getUser,
  getAllUsers,
};
