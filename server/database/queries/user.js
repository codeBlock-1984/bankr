const getUser = `SELECT id, firstName AS firstName, lastName AS lastName, email,
                 type, isAdmin as isAdmin, createdOn AS createdOn FROM users
                 WHERE id = $1`;

const getUserEmail = `SELECT id, firstName AS firstName, lastName AS lastName,
                      email, type, isAdmin as isAdmin, createdOn AS createdOn
                      FROM users
                      WHERE email = $1`;

const getAllUsers = `SELECT id, firstName AS firstName, lastName AS lastName,
                     email, type, isAdmin as isAdmin, createdOn AS createdOn
                     FROM users ORDER BY id ASC`;

const deleteUser = `DELETE FROM users WHERE email = $1
                    RETURNING id`;

const getPassword = `SELECT password FROM users
                     WHERE id = $1`;

const updatePassword = `UPDATE users SET password = $1
                        WHERE id = $2
                        RETURNING id`;

export default {
  getUser,
  getUserEmail,
  getAllUsers,
  deleteUser,
  getPassword,
  updatePassword,
};
