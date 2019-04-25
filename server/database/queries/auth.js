const addUser = `INSERT INTO users
                 (firstName, lastName, email, password, type, isAdmin)
                 VALUES($1, $2, $3, $4, $5, $6)
                 RETURNING id, firstName, lastName, email, type`;

const signIn = `SELECT * FROM users WHERE email = $1`;

export default { addUser, signIn };
